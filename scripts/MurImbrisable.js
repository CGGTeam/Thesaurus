/**
 * @classdesc Objet qui représente une case mur imbrisable
 */
class MurImbrisable extends Objet3D{
  /**
   * Créer un bloc de mur imbrisable à la position (x, y) indiquée. Noter que la position y dénote la position y en 2D
   * du mur dans la grille de jeu et non son élévation en 3D.
   * @param x position x dans la grille de jeu
   * @param y position y  dans la grille de jeu
   */
  constructor (x, y) {
    let vertex = vertexMur;

    let maillage = new Maillage(maillageMur, 0, 10);

    let texels = new TexelColl(texelsMur, 2, 1.0);

    let transform = creerTransformations();
    setPositionsXYZ([x, 0, y], transform);

    super(vertex, maillage, texels, transform, couleursMurs);
  }
}