const tabCodeGrille = Object.freeze(
  [
    Plancher.prototype.constructor,
    MurOuvrable.prototype.constructor,
    MurImbrisable.prototype.constructor,
    PlancherTresor.prototype.constructor
  ]
);
const tabMursOuvrables = [];
const tabMursImbrisables = [];
let wallVertBuffer;
let wallColorBuffer;
let wallTexelBuffer;
let wallMeshBuffer;

class Niveau extends Dessinable {
  constructor (nomFichierGrille) {
    super();
    this.grille = [];
    this.tabCasesLibres = [];
    this.chargerGrille(nomFichierGrille);
    this.intNbOuvreurs = 4;
    this.nomFichierGrille=nomFichierGrille;
    
    //temps du niveau
    this.temps = 30,
    startTimer(this.temps);
  }

  chargerGrille(nomFichierGrille) {
    fetch('https://cggteam.github.io/Thesaurus/' + nomFichierGrille)
      .then(response => response.text()
        .then(contenuFichier => this.traiterGrille(contenuFichier))).catch(e => console.log(e));
  }

  traiterGrille(contenu) {
      this.grille = [];
      let tabContenu = contenu.split(/[\n\r]/);
      for (let i = 0; i < tabContenu.length; i++) {
        this.grille.push([]);
        for (let j = 0; j < tabContenu[i].length; j++) {
          let valeur = parseInt(tabContenu[i].charAt(j));
          if (valeur !== 0 && valeur !== 3) {
            let objCtor = tabCodeGrille[valeur];
            let fctFactory = objCtor.bind(objCtor, j, i);
            let objCase = new fctFactory();
            this.grille[i][j] = objCase;

            if (objCase instanceof MurOuvrable)
              tabMursOuvrables.push(objCase);
            else if (objCase instanceof MurImbrisable)
              tabMursImbrisables.push(objCase);
        }
      }
    }

    for(let x = 0; x < 30; x++){
      for(let y = 0; y < 30; y++){
        if(!this.grille[x][y])
            this.tabCasesLibres.push({x: y, y: x});
      }
    }

    //Scene.getInstance().addDessinable(new Plafond(0,0));
    Scene.getInstance().addDessinable(new Plancher(0,0));
    Scene.getInstance().addDessinable(new PlancherTresor(14,14));
    this.placerTresor();
    this.placerFleche();
    this.placerTransporteur();
    this.placerRecepteur();

    let objgl = Scene.getInstance().objgl;

    wallVertBuffer = objgl.createBuffer();
    objgl.bindBuffer(objgl.ARRAY_BUFFER, wallVertBuffer);
    objgl.bufferData(objgl.ARRAY_BUFFER, vertexMur, objgl.STATIC_DRAW);

    wallColorBuffer = objgl.createBuffer();
    objgl.bindBuffer(objgl.ARRAY_BUFFER, wallColorBuffer);
    objgl.bufferData(objgl.ARRAY_BUFFER, couleursMurs, objgl.STATIC_DRAW);

    wallMeshBuffer = objgl.createBuffer();
    objgl.bindBuffer(objgl.ELEMENT_ARRAY_BUFFER, wallMeshBuffer);
    objgl.bufferData(objgl.ELEMENT_ARRAY_BUFFER, maillageMur.maillage, objgl.STATIC_DRAW);

    wallTexelBuffer = objgl.createBuffer();
    objgl.bindBuffer(objgl.ARRAY_BUFFER, wallTexelBuffer);
    objgl.bufferData(objgl.ARRAY_BUFFER, texCollImbrisables.texel, objgl.STATIC_DRAW);

    demarrer();
  }

  dessiner() {
    let scene = Scene.getInstance();

    // Relier les vertex aux shaders
    scene.objgl.bindBuffer(scene.objgl.ARRAY_BUFFER, wallVertBuffer);
    scene.objgl.vertexAttribPointer(scene.objProgShaders.posVertex, 3, scene.objgl.FLOAT, false, 0, 0);

    // Relier les couleurs aux shaders
    scene.objgl.bindBuffer(scene.objgl.ARRAY_BUFFER, wallColorBuffer);
    scene.objgl.vertexAttribPointer(scene.objProgShaders.couleurVertex, 4, scene.objgl.FLOAT, false, 0, 0);

    // Relier les texels aux shaders
    scene.objgl.bindBuffer(scene.objgl.ARRAY_BUFFER, wallTexelBuffer);
    scene.objgl.vertexAttribPointer(scene.objProgShaders.posTexel, 2, scene.objgl.FLOAT, false, 0, 0);

    // Sélectionner le maillage qu'on va utiliser pour les triangles et les droites
    scene.objgl.bindBuffer(scene.objgl.ELEMENT_ARRAY_BUFFER, wallMeshBuffer);

    // Relier le no de texture et le taux de couleur aux shaders
    scene.objgl.uniform1i(scene.objProgShaders.noTexture, texCollImbrisables.noTex);
    scene.objgl.uniform1f(scene.objProgShaders.pcCouleurTexel, texCollImbrisables.pcCouleur);

    // Activer la texture
    scene.objgl.activeTexture(scene.objgl.TEXTURE0 + texCollImbrisables.noTex);
    scene.objgl.bindTexture(scene.objgl.TEXTURE_2D, scene.tabTextures[texCollImbrisables.noTex]);

    tabMursImbrisables.forEach(e => {
      // Matrice du modèle
      let matModeleVue = mat4.create();
      mat4.identity(matModeleVue);

      // Placer la caméra sur la scène
      mat4.lookAt(getPositionsCameraXYZ(scene.camera),
        getCiblesCameraXYZ(scene.camera),
        getOrientationsXYZ(scene.camera),
        matModeleVue);

      // Appliquer les transformations sur le modèle
      mat4.translate(matModeleVue, getPositionsXYZ(e.transform));
      mat4.scale(matModeleVue, getEchellesXYZ(e.transform));
      mat4.rotateX(matModeleVue, getAngleX(e.transform) * Math.PI / 180);
      mat4.rotateY(matModeleVue, getAngleY(e.transform) * Math.PI / 180);
      mat4.rotateZ(matModeleVue, getAngleZ(e.transform) * Math.PI / 180);

      // Relier la matrice aux shaders
      scene.objgl.uniformMatrix4fv(scene.objProgShaders.matModeleVue, false, matModeleVue);

      // Dessiner les triangles
      scene.objgl.drawElements(scene.objgl.TRIANGLES,  maillageMur.nbTriangles * 3, scene.objgl.UNSIGNED_SHORT, 0);
      // Dessiner les droites à la suite des triangles
      scene.objgl.drawElements(scene.objgl.LINES,  maillageMur.nbDroites * 2, scene.objgl.UNSIGNED_SHORT, maillageMur.nbTriangles * 2 * 3);
    });

    // Relier le no de texture et le taux de couleur aux shaders
    scene.objgl.uniform1i(scene.objProgShaders.noTexture, texCollOuvrable.noTex);
    scene.objgl.uniform1f(scene.objProgShaders.pcCouleurTexel, texCollOuvrable.pcCouleur);

    // Activer la texture
    scene.objgl.activeTexture(scene.objgl.TEXTURE0 + texCollOuvrable.noTex);
    scene.objgl.bindTexture(scene.objgl.TEXTURE_2D, scene.tabTextures[texCollOuvrable.noTex]);

    tabMursOuvrables.forEach(e => {
      // Matrice du modèle
      let matModeleVue = mat4.create();
      mat4.identity(matModeleVue);

      // Placer la caméra sur la scène
      mat4.lookAt(getPositionsCameraXYZ(scene.camera),
        getCiblesCameraXYZ(scene.camera),
        getOrientationsXYZ(scene.camera),
        matModeleVue);

      // Appliquer les transformations sur le modèle
      mat4.translate(matModeleVue, getPositionsXYZ(e.transform));
      mat4.scale(matModeleVue, getEchellesXYZ(e.transform));
      mat4.rotateX(matModeleVue, getAngleX(e.transform) * Math.PI / 180);
      mat4.rotateY(matModeleVue, getAngleY(e.transform) * Math.PI / 180);
      mat4.rotateZ(matModeleVue, getAngleZ(e.transform) * Math.PI / 180);

      // Relier la matrice aux shaders
      scene.objgl.uniformMatrix4fv(scene.objProgShaders.matModeleVue, false, matModeleVue);

      // Dessiner les triangles
      scene.objgl.drawElements(scene.objgl.TRIANGLES, e.ouvert ? 0 : maillageMur.nbTriangles * 3, scene.objgl.UNSIGNED_SHORT, 0);
      // Dessiner les droites à la suite des triangles
      scene.objgl.drawElements(scene.objgl.LINES, e.ouvert ? 0 : maillageMur.nbDroites * 2, scene.objgl.UNSIGNED_SHORT, maillageMur.nbTriangles * 2 * 3);
    });
  }

  //pour reset le niveau
  reChargerGrille(nomFichierGrille) {
    fetch('https://cggteam.github.io/Thesaurus/' + nomFichierGrille)
      .then(response => response.text()
        .then(contenuFichier => this.reTraiterGrille(contenuFichier))).catch(e => console.log(e));
  }
  reTraiterGrille(contenu) {
      this.grille = [];
      let tabContenu = contenu.split(/[\n\r]/);
      for (let i = 0; i < tabContenu.length; i++) {
        this.grille.push([]);
        for (let j = 0; j < tabContenu[i].length; j++) {
          let valeur = parseInt(tabContenu[i].charAt(j));
          if (valeur !== 0 && valeur !== 3) {
            let objCtor = tabCodeGrille[valeur];
            let fctFactory = objCtor.bind(objCtor, j, i);
            let objCase = new fctFactory();
            this.grille[i][j] = objCase;

            if (objCase instanceof MurOuvrable)
              tabMursOuvrables.push(objCase);
            else if (objCase instanceof MurImbrisable)
              tabMursImbrisables.push(objCase);
        }
      }
    }
    Scene.getInstance().addDessinable(new Plafond(0,0));
    Scene.getInstance().addDessinable(new Plancher(0,0));
    Scene.getInstance().addDessinable(new PlancherTresor(14,14));

    let objgl = Scene.getInstance().objgl;

    wallVertBuffer = objgl.createBuffer();
    objgl.bindBuffer(objgl.ARRAY_BUFFER, wallVertBuffer);
    objgl.bufferData(objgl.ARRAY_BUFFER, vertexMur, objgl.STATIC_DRAW);

    wallColorBuffer = objgl.createBuffer();
    objgl.bindBuffer(objgl.ARRAY_BUFFER, wallColorBuffer);
    objgl.bufferData(objgl.ARRAY_BUFFER, couleursMurs, objgl.STATIC_DRAW);

    wallMeshBuffer = objgl.createBuffer();
    objgl.bindBuffer(objgl.ELEMENT_ARRAY_BUFFER, wallMeshBuffer);
    objgl.bufferData(objgl.ELEMENT_ARRAY_BUFFER, maillageMur.maillage, objgl.STATIC_DRAW);

    wallTexelBuffer = objgl.createBuffer();
    objgl.bindBuffer(objgl.ARRAY_BUFFER, wallTexelBuffer);
    objgl.bufferData(objgl.ARRAY_BUFFER, texCollImbrisables.texel, objgl.STATIC_DRAW);
  }


  //recommence le niveau courant
  restartLevel(){

    //reset la map
    this.resetMap();
    
  }
  //plus de temps restant
  outOfTime(){
    //enleve les points
    Sounds.getInstance().playTimesUp();
    Scene.getInstance().intScore -= 200;
    //restart le niveau
    this.restartLevel();
  }
  //passe au niveau suivant
  levelCompleted(){
    Sounds.getInstance().playTresor();

    resetTimer(this.temps);
    //ajoute les poinnts
    Scene.getInstance().intScore += 10 * Scene.getInstance().time;
    Scene.getInstance().intNiveau++;

    //reset la map
    this.resetMap();
    
  }
  gameOver(){
    Sounds.getInstance().playGameOver();
    Scene.getInstance().arreterAnimation();
    Scene.getInstance().context2D.font = "100px Comic Sans MS";
    Scene.getInstance().context2D.fillStyle = "black bold";
    Scene.getInstance().context2D.textAlign = "center";
    Scene.getInstance().context2D.fillText("GAME OVER", Scene.getInstance().objCanvasScore.width/2, Scene.getInstance().objCanvasScore.height/2);
  }
  gameWon(){
    Sounds.getInstance().playWin();
    Scene.getInstance().arreterAnimation();
    Scene.getInstance().context2D.font = "90px Comic Sans MS";
    Scene.getInstance().context2D.fillStyle = "black bold";
    Scene.getInstance().context2D.textAlign = "center";
    Scene.getInstance().context2D.fillText("Partie Gagnée!!!", Scene.getInstance().objCanvasScore.width/2, Scene.getInstance().objCanvasScore.height/2);
  }
  resetMap(){
    //recharger la grille
    this.reChargerGrille(this.nomFichierGrille);

    //reouvrir l'enclot
    Scene.getInstance().tabDessinables[0].grille[13][15] = null;
    tabMursImbrisables.splice(-1,1)

    //restock les ouvreurs
    this.restockOuvreurs();

    //remettre la camera au centre
    Scene.getInstance().repositionnerCamera();

    this.placerTresor();
    this.placerFleche();
    this.placerTransporteur();
    this.placerRecepteur();

    Sounds.getInstance().playLevelStart();
  }
  restockOuvreurs(){
    switch(Scene.getInstance().intNiveau){
      case 1 : case 2 : this.intNbOuvreurs = 4; ;break;
      case 3 : case 4 : this.intNbOuvreurs = 3; break;
      case 5 : case 6 : this.intNbOuvreurs = 2; break;
      case 7 : case 8 : this.intNbOuvreurs = 1; break;
      case 9 : case 10 : this.intNbOuvreurs = 0; break;
    }
  }
  placerTresor(){
    let indexChest = Math.floor(Math.random()*this.tabCasesLibres.length);
    Scene.getInstance().addDessinable(Chest.getInstance(this.tabCasesLibres[indexChest].x,this.tabCasesLibres[indexChest].y));
    this.tabCasesLibres.splice(indexChest,1);
    this.grille[Chest.getInstance().y][Chest.getInstance().x] = Chest.getInstance();
  }
  placerFleche(){
    let intNbFleche = 20 - (Scene.getInstance().intNiveau*2);
    for(let i = 0; i < intNbFleche; i++){
      let indexFleche = Math.floor(Math.random()*this.tabCasesLibres.length);
      Scene.getInstance().addDessinable(new Fleche(this.tabCasesLibres[indexFleche].x,this.tabCasesLibres[indexFleche].y));
      this.tabCasesLibres.splice(indexFleche,1);
    }

  }
  placerTransporteur(){
    let intNbTransporteur = Math.floor(Scene.getInstance().intNiveau/2) + 1;
    for(let i = 0; i < intNbTransporteur; i++){

    let indexTrans = Math.floor(Math.random()*this.tabCasesLibres.length);
    let transporteur = new Teletransporteur(this.tabCasesLibres[indexTrans].x,this.tabCasesLibres[indexTrans].y);
    this.tabCasesLibres.splice(indexTrans,1);

    indexTrans = Math.floor(Math.random()*this.tabCasesLibres.length);
    let recepteur = new Teletransporteur(this.tabCasesLibres[indexTrans].x,this.tabCasesLibres[indexTrans].y, transporteur);
    this.tabCasesLibres.splice(indexTrans,1);
    transporteur.transporteur = recepteur;
  
    Scene.getInstance().addDessinable(transporteur);
    Scene.getInstance().addDessinable(recepteur);
    }
  }

  placerRecepteur(){
    let intNbRecepteur = Scene.getInstance().intNiveau - 1;
  }

}