window.onload = () => {
  let objScene = Scene.getInstance();
  objScene.creerTextures(['Mur.jpg', 'plancher_or.png', 'mur_imbrisable.jpg', 'plafond.jpg', 'Plancher.jpg']);
};

function poursuivre() {
  let objScene = Scene.getInstance();
  objScene.initScene3D();
  objScene.addDessinable(new Niveau('Map.txt'));
  poursuivre2();
}

function poursuivre2() {
  let objScene = Scene.getInstance();
  objScene.dessiner();
  objScene.animer();
}