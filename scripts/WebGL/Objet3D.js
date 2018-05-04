class Objet3D extends Dessinable{
  /**
   *
   * @param scene
   * @param vertex
   * @param typeDessin
   * @param maillage
   * @param {TexelColl} texels
   * @param transformation
   * @param couleurs
   */
  constructor(scene, vertex, typeDessin, maillage, texels, transformation, couleurs=[]) {
    super();
    this.scene = scene;
    this.vertex = vertex;
    this.typeDessin = typeDessin;
    this.maillage = maillage;
    this.couleurs = couleurs;
    this.texels = texels;
    this.transformations = transformation;
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
    scene.objgl.vertexAttribPointer(scene.objProgShaders.couleurVertex, 4, scene.objgl.FLOAT, false, 0, 0)

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

    // Dessiner les triangles
    scene.objgl.drawElements(scene.objgl.TRIANGLES, this.maillage.nbTriangles * 3, scene.objgl.UNSIGNED_SHORT, 0);
    // Dessiner les droites à la suite des triangles
    scene.objgl.drawElements(scene.objgl.LINES, this.maillage.nbDroites * 2, scene.objgl.UNSIGNED_SHORT, this.maillage.nbTriangles * 2 * 3);
  }
}