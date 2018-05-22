/**
 * @classdesc Singleton qui contient l'instance de objgl et d'autres propriétés reliées
 */
class Scene {
  constructor() {
    this.tabDessinables = [];
    this.objCanvas = document.getElementById('cvThesaurus');
    this.objCanvasScore = document.getElementById('cvScore');
    this.context2D = this.objCanvasScore.getContext('2d');
    this.objgl = initWebGL(this.objCanvas);
    this.objProgShaders = initShaders(this.objgl);
    this.intCycleAnimation = null;
    this.camera = null;
    this.tabTextures = null;
    this.binOrthograpique = false;
    this.intScore = 300;
    this.intNiveau = 1;
    
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
  arreterAnimation() {
    cancelAnimationFrame(this.intCycleAnimation);
    this.intCycleAnimation = null;
    console.log(this.intCycleAnimation);
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
    //this.objgl.enable(this.objgl.CULL_FACE);
    //this.objgl.cullFace(this.objgl.BACK);
    setPositionsCameraXYZ([15.5, 1, 15.5], this.camera);
    setCiblesCameraXYZ([15.5, 1, 14], this.camera);
    setOrientationsXYZ([0, 1, 0], this.camera);
  }

  repositionnerCamera(){
    setPositionsCameraXYZ([15.5, 1, 15.5], this.camera);
    setCiblesCameraXYZ([15.5, 1, 14], this.camera);
    setOrientationsXYZ([0, 1, 0], this.camera);
  }

  dessiner() {
    let objgl = this.objgl;
    let objProgShaders = this.objProgShaders;

    // La vue
    objgl.viewport(0, 0, objgl.drawingBufferWidth, objgl.drawingBufferHeight);

    // Matrice de projection
    if (!this.binOrthograpique) {
      let matProjection = mat4.create();
      let fltRapportCanevas = objgl.drawingBufferWidth / objgl.drawingBufferHeight;
      mat4.perspective(45, fltRapportCanevas, 0.01, 150, matProjection);

      // Relier la matrice aux shaders
      objgl.uniformMatrix4fv(objProgShaders.matProjection, false, matProjection);
    } else {
      let matProjection = mat4.create();
      mat4.ortho(-16, 16, -16, 16, 0, 100, matProjection);

      // Relier la matrice aux shaders
      objgl.uniformMatrix4fv(objProgShaders.matProjection, false, matProjection);
    }


    this.tabDessinables.forEach(o => o.dessiner());
  }

  mettreAJourAnimation() {
    this.tabDessinables.forEach(o => o.mettreAJourAnimation());
    updatePosCamera();
    if(!binAerien)
      this.dessineUI();
    else
      this.context2D.clearRect(0,0,this.objCanvasScore.width,this.objCanvasScore.height);
  }

  static getInstance() {
    if (!Scene.instance)
      Scene.instance = new Scene();
    return Scene.instance;
  }

  addDessinable(obj) {
    this.tabDessinables.push(obj);
  }

  removeDessinable(obj) {
    var index = this.tabDessinables.indexOf(obj);
    if (index > -1) {
      this.tabDessinables.splice(index, 1);
    }
  }
  dessineUI(){
    //effacer l'ancien ui
    this.context2D.clearRect(0,0,this.objCanvasScore.width,this.objCanvasScore.height);
    //score
    this.intScore;
    this.tabDessinables[0].intNbOuvreurs;
    this.context2D.textBaseline="middle"; 
    this.context2D.font = "50px Comic Sans MS";
    this.context2D.fillStyle = "black";
    this.context2D.textAlign = "left";
    this.context2D.fillText("Score: " + this.intScore, this.objCanvasScore.width/100, this.objCanvasScore.height -this.objCanvasScore.height/25 );

    //Nombre d'ouvreurs de porte
    this.context2D.fillText("Ouvreurs: " + this.tabDessinables[0].intNbOuvreurs, this.objCanvasScore.width/100 * 65, this.objCanvasScore.height -this.objCanvasScore.height/25 );

    //Temps 
    let al=this.time/this.duration * 100;

    let start=4.72;
    let diff;
    
    let cw=this.context2D.canvas.width/1.1;
    let ch=this.context2D.canvas.height/8;

    diff=(al/100)*Math.PI*2;
    this.context2D.beginPath();
    this.context2D.stroke();
    this.context2D.fillStyle='#000';
    this.context2D.strokeStyle='#2669d6';
    this.context2D.textAlign='center';
    this.context2D.lineWidth=15;
    this.context2D.font = '30px Comic Sans MS';
    this.context2D.beginPath();
    this.context2D.arc(cw,ch,60,start,diff+start,false);
    this.context2D.stroke();
    this.context2D.fillText(this.time,cw+2,ch);

    //enleve 10pts par seconde de vue aerienne
    if(binAerien && this.oldDif != diff){
      this.intScore-=10;
      //si il y a pas assez de points pour restez en vue aérienne
      if( this.intScore<10){
        binAerien = false;
        this.binOrthograpique = binAerien;
        toggleVueAerienne(binAerien);
      }
    }
    this.oldDif = diff;

    //niveau
    this.context2D.beginPath();
    this.context2D.fillStyle='#2669d6';
    this.context2D.fillRect(0,0,60,60);
    this.context2D.fillStyle='#000';
    this.context2D.fillText(this.intNiveau,30,30);

  }

  setTime(time, duration) {  
    this.time=time;
    this.duration = duration;
  }
    
}
