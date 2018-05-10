const maillagePlafond = new Uint16Array([
  0, 1, 2,
  1, 3, 2,
]);
/**
 * @classdesc Objet qui représente une case de plafond
 */
class Plafond extends Objet3D{
  /**
   * Créer un bloc de mur imbrisable à la position (x, y) indiquée. Noter que la position y dénote la position y en 2D
   * du mur dans la grille de jeu et non son élévation en 3D.
   * @param x position x dans la grille de jeu
   * @param y position y  dans la grille de jeu
   */
  constructor (x, y) {
    let vertex = new Float32Array([
       0.0, 2.0,  0.0, //0: Coin Bas Gauche
      31.0, 2.0,  0.0, //1: Coin Bas Droit
       0.0, 2.0, 31.0, //2: Coin Bas Gauche
      31.0, 2.0, 31.0, //3: Coin Bas Droit
    ]);

    let maillage = new Maillage(maillagePlafond, 0, 2);

    let texels = new TexelColl(new Float32Array([
      0.0, 31.0, //0: Coin Bas Gauche
      31.0, 31.0, //1: Coin Bas Droit
      0.0, 0.0, //2: Coin Haut Gauche
      31.0, 0.0, //3: Coin Haut Droit
    ]), 3, 1.0);

    let transform = creerTransformations();
    setPositionsXYZ([x, 0, y], transform);

    super(vertex, maillage, texels, transform, couleursPlat);
  }
}