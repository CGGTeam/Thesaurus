
class Scene {
  constructor() {
    this.objCanvas = document.getElementById('cvThesaurus');
    this.objgl = initWebGL(this.objCanvas);
    this.objProgShaders = initShaders(this.objgl);
    this.intCycleAnimation = null;
    this.objNiveau = null;
    this.camera = null;
    this.initScene3D();
    this.dessiner();
    this.animer();
  }

  animer() {
    // Un cycle d'animation
    // Requête pour le prochain cycle
    this.intCycleAnimation = requestAnimationFrame(() => this.animer);

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
    setPositionsCameraXYZ([0, 0, 3], this.camera);
    setCiblesCameraXYZ([0, 0, 0], this.camera);
    setOrientationsXYZ([0, 1, 0], this.camera);

    this.objNiveau = new Niveau();
  }

  dessiner() {
    // La vue
    this.objgl.viewport(0, 0, this.objgl.drawingBufferWidth, this.objgl.drawingBufferHeight);

    // Matrice de projection
    let matProjection = mat4.create();
    let fltRapportCanevas = this.objgl.drawingBufferWidth / this.objgl.drawingBufferHeight;
    mat4.perspective(45, fltRapportCanevas, 0.01, 100, matProjection);

    // Relier la matrice aux shaders
    this.objgl.uniformMatrix4fv(this.objProgShaders.matProjection, false, matProjection);

    this.objNiveau.dessiner();
  }

  mettreAJourAnimation() {
    this.objNiveau.mettreAJourAnimation();
  }

  static getInstance() {
    if (!Scene.instance)
      Scene.instance = new Scene();
    return Scene.instance;
  }
}