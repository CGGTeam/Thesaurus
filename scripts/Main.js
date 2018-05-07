window.onload = () => {
  let objScene = Scene.getInstance();
  objScene.creerTextures(['Mur.jpg', 'plancher_or.png', 'mur_imbrisable.jpg', 'plafond.jpg']);
};

function poursuivre() {
  let objScene = Scene.getInstance();
  objScene.initScene3D();
  objScene.dessiner();
  objScene.addDessinable(new Plafond(0, -1));
  objScene.addDessinable(new MurImbrisable(0, 1));
  objScene.animer();
}