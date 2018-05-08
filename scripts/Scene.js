/**
 * @classdesc Singleton qui contient l'instance de objgl et d'autres propriétés reliées
 */
class Scene {
  constructor() {
    this.tabDessinables = [];
    this.objCanvas = document.getElementById('cvThesaurus');
    this.objgl = initWebGL(this.objCanvas);
    this.objProgShaders = initShaders(this.objgl);
    this.intCycleAnimation = null;
    this.camera = null;
    this.tabTextures = null;
  }

  animer() {
    // Un cycle d'animation
    // Requête pour le prochain cycle
    this.intCycleAnimation = requestAnimationFrame(() => this.animer());

    // Le cycle d'animation
    this.effacerCanevas();
    this.mettreAJourAnimation();
    this.dessiner();
  }

  effacerCanevas() {
    // Met la couleur d'effacement au noir et complétement opaque
    this.objgl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Efface les couleurs et le buffer de profondeur.
    this.objgl.clear(this.objgl.COLOR_BUFFER_BIT| this.objgl.DEPTH_BUFFER_BIT);
  }

  initScene3D() {
    // La caméra
    this.camera = creerCamera();
    // setPositionsCameraXYZ([0, 100, 0], this.camera);
    // setCiblesCameraXYZ([0, 1, 0], this.camera);
    // setOrientationsXYZ([0, 0, 1], this.camera);
    setPositionsCameraXYZ([0, 1, 3], this.camera);
    setCiblesCameraXYZ([0, 1, 0], this.camera);
    setOrientationsXYZ([0, 1, 0], this.camera);
  }

  dessiner() {
    let objgl = this.objgl;
    let objProgShaders = this.objProgShaders;

    // La vue
    objgl.viewport(0, 0, objgl.drawingBufferWidth, objgl.drawingBufferHeight);

    // Matrice de projection
    let matProjection = mat4.create();
    let fltRapportCanevas = objgl.drawingBufferWidth / objgl.drawingBufferHeight;
    mat4.perspective(45, fltRapportCanevas, 0.01, 150, matProjection);

    // Relier la matrice aux shaders
    objgl.uniformMatrix4fv(objProgShaders.matProjection, false, matProjection);

    this.tabDessinables.forEach(o => o.dessiner());
  }

  mettreAJourAnimation() {
    this.tabDessinables.forEach(o => o.mettreAJourAnimation());
      updatePosCamera(this.camera);
  }

  static getInstance() {
    if (!Scene.instance)
      Scene.instance = new Scene();
    return Scene.instance;
  }

  addDessinable(obj) {
    this.tabDessinables.push(obj);
  }

  /**
   * Prend un tableau de textures et les load dans WebGL
   * @param {Array<string>} nomsTex tableau des noms/chemins des images de texture.
   */
  creerTextures(nomsTex) {
    creerTextures(this.objgl, nomsTex, this.poursuivre, this);
  }

  poursuivre(tabTextures) {
    this.tabTextures = tabTextures;
    poursuivre(this.tabTextures);
  }
}