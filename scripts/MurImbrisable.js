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
    let vertex = new Float32Array([
      //Face arrière
      -0.5, 0.0,-0.5, //0: Coin Bas Gauche
      0.5, 0.0,-0.5, //1: Coin Bas Droit
      -0.5, 2.0,-0.5, //2: Coin Haut Gauche
      0.5, 2.0,-0.5, //3: Coin Haut Droit

      //Face avant
      -0.5, 0.0, 0.5, //4: Coin Bas Gauche
      0.5, 0.0, 0.5, //5: Coin Bas Droit
      -0.5, 2.0, 0.5, //6: Coin Haut Gauche
      0.5, 2.0, 0.5, //7: Coin Haut Droit

      //Face gauche
      -0.5, 0.0, 0.5, //8: Coin Bas Gauche
      -0.5, 0.0,-0.5, //9: Coin Bas Droit
      -0.5, 2.0, 0.5, //10: Coin Haut Droit
      -0.5, 2.0,-0.5, //11: Coin Haut Gauche

      //Face droite
      0.5, 0.0, 0.5, //12: Coin Bas Gauche
      0.5, 0.0,-0.5, //13: Coin Bas Droit
      0.5, 2.0, 0.5, //14: Coin Haut Droit
      0.5, 2.0,-0.5, //15: Coin Haut Gauche
    ]);

    let maillage = new Maillage(new Uint16Array([
      //Face Avant
      0, 1, 2,
      1, 2, 3,
      //Face Arrière
      4, 5, 6,
      5, 6, 7,
      //Face Bas
      0, 4, 5,
      0, 1, 5,
      //Face Haut
      2, 3, 6,
      6, 7, 3,
      //Face Gauche
      8, 9, 10,
      9, 10, 11,
      //Face Droite
      12, 13, 14,
      13, 14, 15
    ]), 0, 12);

    let texels = new TexelColl(new Float32Array([
      //Face arrière
      0.0, 2.0, //0: Coin Bas Gauche
      1.0, 2.0, //1: Coin Bas Droit
      0.0, 0.0, //2: Coin Haut Gauche
      1.0, 0.0, //3: Coin Haut Droit

      //Face avant
      0.0, 2.0, //4: Coin Bas Gauche
      1.0, 2.0, //5: Coin Bas Droit
      0.0, 0.0, //6: Coin Haut Gauche
      1.0, 0.0,  //7: Coin Haut Droit

      //Face gauche
      0.0, 2.0, //8: Coin Bas Gauche
      1.0, 2.0, //9: Coin Bas Droit
      0.0, 0.0, //10: Coin Haut Gauche
      1.0, 0.0, //11: Coin Haut Droit

      //Face droite
      0.0, 2.0, //12: Coin Bas Gauche
      1.0, 2.0, //13: Coin Bas Droit
      0.0, 0.0, //14: Coin Haut Gauche
      1.0, 0.0  //15: Coin Haut Droit
    ]), 2, 1.0);

    let transform = creerTransformations();
    setPositionsXYZ([x, 0, y], transform);

    super(vertex, maillage, texels, transform);
  }
}