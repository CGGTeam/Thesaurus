window.onload = () => {
  let objScene = Scene.getInstance();
  objScene.creerTextures(['Mur.jpg', 'plancher_or.png', 'mur_imbrisable.jpg']);
};

function poursuivre() {
  let objScene = Scene.getInstance();
  objScene.initScene3D();
  objScene.dessiner();
  objScene.addDessinable(new MurImbrisable(0, 0));
  objScene.animer();
}