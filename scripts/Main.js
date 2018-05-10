window.onload = () => {
  chargerImages(['Mur.jpg', 'plancher_or.png', 'mur_imbrisable.jpg', 'plafond.jpg', 'Plancher.jpg']);
};

function initialiserScene(tabImages) {
  let objScene = Scene.getInstance();
  objScene.tabTextures = creerTextures(objScene.objgl, tabImages);
  objScene.initScene3D();
  objScene.addDessinable(new Niveau('Map.txt'));
  demarrer();
}

function demarrer() {
  let objScene = Scene.getInstance();
  objScene.dessiner();
  objScene.animer();
}