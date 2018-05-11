const vertexFleche = new Float32Array([

/*
        c
        |\  
a      b| \
--------|  \ d
--------|  /
g      f| /
        |/
        e
*/

    //Face avant
    0.0, 0.5, 0.5,  //0: a
    1.0, 0.5, 0.5,  //1: b
    1.0, 1.0, 0.5,  //2: c
    1.5,0.25, 0.5,  //3: d
    1.0,-0.5, 0.5,  //4: e
    1.0, 0.0, 0.5,  //5: f
    0.0, 0.0, 0.5,  //6: g

    //Face arrière
    0.0, 0.5, 0.0,  //7: a
    1.0, 0.5, 0.0,  //8: b
    1.0, 1.0, 0.0,  //9: c
    1.5,0.25, 0.0,  //10: d
    1.0,-0.5, 0.0,  //11: e
    1.0, 0.0, 0.0,  //12: f
    0.0, 0.0, 0.0,  //13: g
  
  ]);
  
  const maillageFleche = new Uint16Array([
    
    //TRIANGLES
    //Face Avant
    6, 0, 1,
    1, 5, 6,
    2, 3, 4,
    //Face arriere
    13, 7, 8,
    8, 12, 13,
    9, 10, 11,
    //Face gauche
    13, 7, 0,
     0, 6,13,
     2, 8, 9,
     2, 1, 8,
     12, 5, 11,
     5, 4, 11,
     //Face haut
     0, 7, 8,
     0, 8, 1,
     2, 9, 10,
     2, 10, 3,
     //Face dessous
     6, 13, 12,
     6, 12, 5,
     4, 11, 10,
     4, 10, 3,

    //LIGNES
    //Face avant
    0, 1,
    1, 2,
    2, 3,
    3, 4,
    4, 5,
    5, 6,
    //Face arriere
    7, 8,
    8, 9,
    9, 10,
    10, 11,
    11, 12,
    12, 13,
    //Ponts
    0, 7,
    1, 8,
    2, 9,
    3, 10,
    4, 11,
    5, 12,
    6, 13

  ]);
  
  const texelsFleche = new Float32Array((new Array(28)).fill(0.0));
  
  const couleursFleche = new Float32Array([
    0.93, 0.74, 0.16, 1.0,
    0.93, 0.74, 0.16, 1.0,
    0.93, 0.74, 0.16, 1.0,
    0.93, 0.74, 0.16, 1.0,
    0.93, 0.74, 0.16, 1.0,
    0.93, 0.74, 0.16, 1.0,
    0.93, 0.74, 0.16, 1.0,
    0.93, 0.74, 0.16, 1.0,
    0.93, 0.74, 0.16, 1.0,
    0.93, 0.74, 0.16, 1.0,
    0.93, 0.74, 0.16, 1.0,
    0.93, 0.74, 0.16, 1.0,
    0.93, 0.74, 0.16, 1.0,
    0.93, 0.74, 0.16, 1.0
  ]);

  const couleursFlecheLignes = new Float32Array([
      0.0, 0.0, 0.0, 1.0,
      0.0, 0.0, 0.0, 1.0,
      0.0, 0.0, 0.0, 1.0,
      0.0, 0.0, 0.0, 1.0,
      0.0, 0.0, 0.0, 1.0,
      0.0, 0.0, 0.0, 1.0,
      0.0, 0.0, 0.0, 1.0,
      0.0, 0.0, 0.0, 1.0,
      0.0, 0.0, 0.0, 1.0,
      0.0, 0.0, 0.0, 1.0,
      0.0, 0.0, 0.0, 1.0,
      0.0, 0.0, 0.0, 1.0,
      0.0, 0.0, 0.0, 1.0,
      0.0, 0.0, 0.0, 1.0
  ]);
  
  /**
   * @classdesc Objet qui représente une case mur
   */
  class Fleche extends Objet3D{
    /**
     * Créer un bloc de mur à la position (x, y) indiquée. Noter que la position y dénote la position y en 2D du mur dans
     * la grille de jeu et non son élévation en 3D.
     * @param x position x dans la grille de jeu
     * @param y position y  dans la grille de jeu
     */
    constructor (x, y) {
      let vertex = vertexFleche;
  
      let maillage = new Maillage(maillageFleche, 19, 20);
  
      let texels = new TexelColl(texelsFleche, 5, 0.0);
  
      let transform = creerTransformations();
      setPositionsXYZ([x, 0, y], transform);
  
      super(vertex, maillage, texels, transform, couleursFleche);

      let objgl = this.scene.objgl;
      this.couleursLignes = objgl.createBuffer();
      objgl.bindBuffer(objgl.ARRAY_BUFFER, this.couleursLignes);
      objgl.bufferData(objgl.ARRAY_BUFFER, couleursFlecheLignes, objgl.STATIC_DRAW); //TODO: donner option de changer
    }

    dessiner() {
        let scene = this.scene;
    
        // Matrice du modèle
        let matModeleVue = mat4.create();
        mat4.identity(matModeleVue);
    
        // Placer la caméra sur la scène
        mat4.lookAt(getPositionsCameraXYZ(scene.camera),
          getCiblesCameraXYZ(scene.camera),
          getOrientationsXYZ(scene.camera),
          matModeleVue);
    
        // Appliquer les transformations sur le modèle
        mat4.translate(matModeleVue, getPositionsXYZ(this.transformations));
        mat4.scale(matModeleVue, getEchellesXYZ(this.transformations));
        mat4.rotateX(matModeleVue, getAngleX(this.transformations) * Math.PI / 180);
        mat4.rotateY(matModeleVue, getAngleY(this.transformations) * Math.PI / 180);
        mat4.rotateZ(matModeleVue, getAngleZ(this.transformations) * Math.PI / 180);
    
        // Relier la matrice aux shaders
        scene.objgl.uniformMatrix4fv(scene.objProgShaders.matModeleVue, false, matModeleVue);
    
        // Relier les vertex aux shaders
        scene.objgl.bindBuffer(scene.objgl.ARRAY_BUFFER, this.vertex);
        scene.objgl.vertexAttribPointer(scene.objProgShaders.posVertex, 3, scene.objgl.FLOAT, false, 0, 0);
    
        // Relier les couleurs aux shaders
        scene.objgl.bindBuffer(scene.objgl.ARRAY_BUFFER, this.couleurs);
        scene.objgl.vertexAttribPointer(scene.objProgShaders.couleurVertex, 4, scene.objgl.FLOAT, false, 0, 0);
    
        // Activer la texture
        scene.objgl.activeTexture(scene.objgl.TEXTURE0 + this.texels.noTex);
        scene.objgl.bindTexture(scene.objgl.TEXTURE_2D, scene.tabTextures[this.texels.noTex]);
    
        // Relier les texels aux shaders
        scene.objgl.bindBuffer(scene.objgl.ARRAY_BUFFER, this.texels);
        scene.objgl.vertexAttribPointer(scene.objProgShaders.posTexel, 2, scene.objgl.FLOAT, false, 0, 0);
    
        // Relier le no de texture et le taux de couleur aux shaders
        scene.objgl.uniform1i(scene.objProgShaders.noTexture, this.texels.noTex);
        scene.objgl.uniform1f(scene.objProgShaders.pcCouleurTexel, this.texels.pcCouleur);
    
        // Sélectionner le maillage qu'on va utiliser pour les triangles et les droites
        scene.objgl.bindBuffer(scene.objgl.ELEMENT_ARRAY_BUFFER, this.maillage);

        scene.objgl.drawElements(scene.objgl.TRIANGLES, this.maillage.nbTriangles * 3, scene.objgl.UNSIGNED_SHORT, 0);

        // Relier les couleurs aux shaders
        scene.objgl.bindBuffer(scene.objgl.ARRAY_BUFFER, this.couleursLignes);
        scene.objgl.vertexAttribPointer(scene.objProgShaders.couleurVertex, 4, scene.objgl.FLOAT, false, 0, 0);

        // Dessiner les droites à la suite des triangles
        scene.objgl.drawElements(scene.objgl.LINES, this.maillage.nbDroites * 2, scene.objgl.UNSIGNED_SHORT, this.maillage.nbTriangles * 2 * 3);
      }
  }