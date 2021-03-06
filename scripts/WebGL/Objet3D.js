/**
 * @classdesc Classe générale qui sert à créer un objet 3D en WebGL. Non-abstraite mais faite dans le but d'être étendue.
 */
class Objet3D extends Dessinable{
  /**
   * Créé un Objet3D
   * @param {Scene} scene Objet Scene. Il ne devrait avoir qu'une scène par Canvas
   * @param {Float32Array} vertex - tableau de vertex (chaque vertex équivaut à 3 valeurs float dans le tableau (x,y,z))
   * @param {Maillage} maillage - Objet Maillage de la forme 3D
   * @param {TexelColl} texels - Objet TexelColl de la forme 3D
   * @param {Array<number>} transformation - Les transformations présentes sur l'objet
   * @param {Float32Array} couleurs - Tableau de couleurs en RGBA. La longueur devrait être = vertex.length / 3 * 4
   * (4 valeurs par vertex)
   */
  constructor(vertex, maillage, texels, transformation, couleurs, scene = Scene.getInstance()) {
    super();

    this.scene = scene;
    let objgl = scene.objgl;

    this.vertex = objgl.createBuffer();
    objgl.bindBuffer(objgl.ARRAY_BUFFER, this.vertex);
    objgl.bufferData(objgl.ARRAY_BUFFER, vertex, objgl.STATIC_DRAW); //TODO: donner option de changer

    this.couleurs = objgl.createBuffer();
    objgl.bindBuffer(objgl.ARRAY_BUFFER, this.couleurs);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(couleurs), objgl.STATIC_DRAW); //TODO: donner option de changer

    this.maillage = objgl.createBuffer();
    objgl.bindBuffer(objgl.ELEMENT_ARRAY_BUFFER, this.maillage);
    objgl.bufferData(objgl.ELEMENT_ARRAY_BUFFER, maillage.maillage, objgl.STATIC_DRAW); //TODO: donner option de changer
    this.maillage.nbTriangles = maillage.nbTriangles;
    this.maillage.nbDroites = maillage.nbDroites;

    this.texels = objgl.createBuffer();
    objgl.bindBuffer(objgl.ARRAY_BUFFER, this.texels);
    objgl.bufferData(objgl.ARRAY_BUFFER, texels.texel, objgl.STATIC_DRAW); //TODO: donner option de changer
    this.texels.noTex = texels.noTex;
    this.texels.pcCouleur = texels.pcCouleur;

    this.transformations = transformation;
  }

  dessiner() {
    let scene = this.scene;

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

    // Dessiner les triangles
    scene.objgl.drawElements(scene.objgl.TRIANGLES, this.maillage.nbTriangles * 3, scene.objgl.UNSIGNED_SHORT, 0);
    // Dessiner les droites à la suite des triangles
    scene.objgl.drawElements(scene.objgl.LINES, this.maillage.nbDroites * 2, scene.objgl.UNSIGNED_SHORT, this.maillage.intNbTriangles * 2 * 3);
  }
}