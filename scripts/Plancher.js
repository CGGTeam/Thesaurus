class Plancher extends Objet3D{
  /**
   * Créer un bloc de mur imbrisable à la position (x, y) indiquée. Noter que la position y dénote la position y en 2D
   * du mur dans la grille de jeu et non son élévation en 3D.
   * @param x position x dans la grille de jeu
   * @param y position y  dans la grille de jeu
   */
  constructor (x, y) {
    let vertex = new Float32Array([
      -0.5, 0.0,-0.5, //0: Coin Bas Gauche
       0.5, 0.0,-0.5, //1: Coin Bas Droit
      -0.5, 0.0, 0.5, //2: Coin Haut Gauche
       0.5, 0.0, 0.5, //3: Coin Haut Droit
    ]);

    let maillage = new Maillage(new Uint16Array([
      0, 1, 2,
      1, 2, 3,
    ]), 0, 2);

    let texels = new TexelColl(new Float32Array([
      0.0, 1.0, //0: Coin Bas Gauche
      1.0, 1.0, //1: Coin Bas Droit
      0.0, 0.0, //2: Coin Haut Gauche
      1.0, 0.0, //3: Coin Haut Droit
    ]), 4, 1.0);

    let transform = creerTransformations();
    setPositionsXYZ([x, 0, y], transform);

    super(vertex, maillage, texels, transform);
  }
}
