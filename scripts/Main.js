window.onload = () => {
  let objScene = Scene.getInstance();
  objScene.creerTextures(['Mur.jpg']);
};

function poursuivre() {
  let objScene = Scene.getInstance();
  objScene.initScene3D();
  objScene.dessiner();
  objScene.addDessinable(new Mur(0, 0));
  objScene.animer();
}