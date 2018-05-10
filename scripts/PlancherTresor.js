/**
 * @classdesc Objet qui représente une case de plancher au centre du dédale
 */
class PlancherTresor extends Objet3D{
  /**
   * Créer un bloc de mur imbrisable à la position (x, y) indiquée. Noter que la position y dénote la position y en 2D
   * du mur dans la grille de jeu et non son élévation en 3D.
   * @param x position x dans la grille de jeu
   * @param y position y  dans la grille de jeu
   */
  constructor (x, y) {
    let vertex = new Float32Array([
      0.0, 0.0001, 0.0, //0: Coin Bas Gauche
      3.0, 0.0001, 0.0, //1: Coin Bas Droit
      0.0, 0.0001, 3.0, //2: Coin Bas Gauche
      3.0, 0.0001, 3.0//3: Coin Bas Droit
    ]);

    let maillage = new Maillage(maillagePlancher, 0, 2);

    let texels = new TexelColl(new Float32Array([
      0.0, 0.0,
      3.0, 0.0,
      0.0, 3.0,
      3.0, 3.0
    ]), 1, 1.0);

    let transform = creerTransformations();
    setPositionsXYZ([x, 0, y], transform);

    super(vertex, maillage, texels, transform, couleursPlat);
  }
}