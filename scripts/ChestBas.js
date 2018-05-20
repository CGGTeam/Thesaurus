const vertexChest = new Float32Array([
    //Face arrière
    0.0, 0.0, 0.0, //0: Coin Bas Gauche
    0.5, 0.0, 0.0, //1: Coin Bas Droit
    0.0, 0.25, 0.0, //2: Coin Haut Gauche
    0.5, 0.25, 0.0, //3: Coin Haut Droit
  
    //Face avant
    0.0, 0.0, 0.25, //4: Coin Bas Gauche
    0.5, 0.0, 0.25, //5: Coin Bas Droit
    0.0, 0.25, 0.25, //6: Coin Haut Gauche
    0.5, 0.25, 0.25, //7: Coin Haut Droit
  
    //Face gauche
    0.0, 0.0, 0.25, //8: Coin Bas Gauche
    0.0, 0.0, 0.0, //9: Coin Bas Droit
    0.0, 0.25, 0.25, //10: Coin Haut Droit
    0.0, 0.25, 0.0, //11: Coin Haut Gauche
  
    //Face droite
    0.5, 0.0, 0.25, //12: Coin Bas Gauche
    0.5, 0.0, 0.0, //13: Coin Bas Droit
    0.5, 0.25, 0.25, //14: Coin Haut Droit
    0.5, 0.25, 0.0, //15: Coin Haut Gauche
  ]);
  
  const maillageChest = new Uint16Array([
    //Face Avant
    0, 1, 2,
    1, 2, 3,
    //Face Gauche
    8, 9, 10,
    9, 10, 11,
    //Face Arrière
    4, 5, 6,
    5, 6, 7,
    //Face Droite
    12, 13, 14,
    13, 14, 15
  ]);
  
  const texelsChest = new Float32Array([
    //Face arrière
    0.0, 0.25, //0: Coin Bas Gauche
    0.5, 0.25, //1: Coin Bas Droit
    0.0, 0.0, //2: Coin Haut Gauche
    0.5, 0.0, //3: Coin Haut Droit
  
    //Face avant
    0.0, 0.25, //4: Coin Bas Gauche
    0.5, 0.25, //5: Coin Bas Droit
    0.0, 0.0, //6: Coin Haut Gauche
    0.5, 0.0,  //7: Coin Haut Droit
  
    //Face gauche
    0.0, 0.25, //8: Coin Bas Gauche
    0.5, 0.25, //9: Coin Bas Droit
    0.0, 0.0, //10: Coin Haut Gauche
    0.5, 0.0, //11: Coin Haut Droit
  
    //Face droite
    0.0, 0.25, //12: Coin Bas Gauche
    0.5, 0.25, //13: Coin Bas Droit
    0.0, 0.0, //14: Coin Haut Gauche
    0.5, 0.0  //15: Coin Haut Droit
  ]);
  
  const couleursChest = new Float32Array([
    0.0, 0.0, 0.0, 0.25,
    0.0, 0.0, 0.0, 0.25,
    0.0, 0.0, 0.0, 0.25,
    0.0, 0.0, 0.0, 0.25,
    0.0, 0.0, 0.0, 0.25,
    0.0, 0.0, 0.0, 0.25,
    0.0, 0.0, 0.0, 0.25,
    0.0, 0.0, 0.0, 0.25,
    0.0, 0.0, 0.0, 0.25,
    0.0, 0.0, 0.0, 0.25,
    0.0, 0.0, 0.0, 0.25,
    0.0, 0.0, 0.0, 0.25,
    0.0, 0.0, 0.0, 0.25,
    0.0, 0.0, 0.0, 0.25,
    0.0, 0.0, 0.0, 0.25,
    0.0, 0.0, 0.0, 0.25
  ]);
  
  /**
   * @classdesc Objet qui représente une case mur
   */
  class ChestBas extends Objet3D{
    /**
     * Créer un bloc de mur à la position (x, y) indiquée. Noter que la position y dénote la position y en 2D du mur dans
     * la grille de jeu et non son élévation en 3D.
     * @param x position x dans la grille de jeu
     * @param y position y  dans la grille de jeu
     */
    constructor (x, y) {
      let vertex = vertexChest;
  
      let maillage = new Maillage(maillageChest, 0, 8);
  
      let texels = new TexelColl(texelsChest, 5, 1.0);
  
      let transform = creerTransformations();
      setAngleY(Math.PI * 2, transform);
      setPositionsXYZ([x, 0, y], transform);

  
      let couleur = [];
  
      super(vertex, maillage, texels, transform, couleursChest);
    }
  }