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
  }

  chargerGrille(nomFichierGrille) {
    fetch('https://cggteam.github.io/Thesaurus/' + nomFichierGrille)
      .then(response => response.text()
        .then(contenuFichier => this.traiterGrille(contenuFichier))).catch(e => console.log(e));
  }

  traiterGrille(contenu) {
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

    let indexChest = Math.floor(Math.random()*this.tabCasesLibres.length);
    Scene.getInstance().addDessinable(Chest.getInstance(this.tabCasesLibres[indexChest].x,this.tabCasesLibres[indexChest].y));
    this.tabCasesLibres.splice(indexChest,1);

    for(let i = 0; i < 10; i++){
      let indexFleche = Math.floor(Math.random()*this.tabCasesLibres.length);
      Scene.getInstance().addDessinable(new Fleche(this.tabCasesLibres[indexFleche].x,this.tabCasesLibres[indexFleche].y));
      this.tabCasesLibres.splice(indexFleche,1);
    }

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
}