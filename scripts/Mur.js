/**
 * @classdesc Objet qui représente une case mur
 */
class Mur extends Objet3D{
  /**
   * Créer un bloc de mur à la position (x, y) indiquée. Noter que la position y dénote la position y en 2D du mur dans
   * la grille de jeu et non son élévation en 3D.
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
       0.5, 2.0, 0.5 //7: Coin Haut Droit
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
      0, 2, 4,
      4, 6, 0,
      //Face Droite
      1, 3, 5,
      5, 7, 1
    ]), 0, 12);

    let texels = new TexelColl(new Float32Array([
      //Face arrière
       0.0, 1.0, //0: Coin Bas Gauche
       1.0, 1.0, //1: Coin Bas Droit
       0.0, 0.0, //2: Coin Haut Gauche
       1.0, 0.0, //3: Coin Haut Droit

      //Face avant
       0.0, 1.0, //4: Coin Bas Gauche
       1.0, 1.0, //5: Coin Bas Droit
       0.0, 0.0, //6: Coin Haut Gauche
       1.0, 0.0  //7: Coin Haut Droit
    ]), 0.0, 1.0);

    let transform = creerTransformations();
    setPositionsXYZ([x, 0, y], transform);

    super(vertex, maillage, texels, transform);
  }
}