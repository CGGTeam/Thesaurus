window.onload = () => {
  let objScene = Scene.getInstance();
  objScene.addDessinable(new Niveau());
  objScene.animer();
};
