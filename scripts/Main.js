
//VARIABLE POUR LE TEMPS D'UN NIVEAU
var temps = 60;

var musDebutPlayed = false;
window.onload = () => {
  chargerImages(['Mur.jpg', 'PlancherCentre.jpg', 'mur_imbrisable.jpg', 'plafond.jpg', 'Plancher.png', 'bois.jpg']);
};

function initialiserScene(tabImages) {
  let objScene = Scene.getInstance();
  let sounds = Sounds.getInstance();
  objScene.tabTextures = creerTextures(objScene.objgl, tabImages);
  objScene.initScene3D();
  objScene.addDessinable(new Niveau('Map.txt'));
  
}

function demarrer() {
  let objScene = Scene.getInstance();
  objScene.dessiner();
  objScene.animer();
}