
  
  const maillageCylindre = new Uint16Array([
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
  
  const texelsCylindre = new Float32Array([
    //Face arrière
    0.0, 1.0, //0: Coin Bas Gauche
    2.0, 1.0, //1: Coin Bas Droit
    0.0, 0.0, //2: Coin Haut Gauche
    2.0, 0.0, //3: Coin Haut Droit
  
    //Face avant
    0.0, 1.0, //4: Coin Bas Gauche
    2.0, 1.0, //5: Coin Bas Droit
    0.0, 0.0, //6: Coin Haut Gauche
    2.0, 0.0,  //7: Coin Haut Droit
  
    //Face gauche
    0.0, 1.0, //8: Coin Bas Gauche
    2.0, 1.0, //9: Coin Bas Droit
    0.0, 0.0, //10: Coin Haut Gauche
    2.0, 0.0, //11: Coin Haut Droit
  
    //Face droite
    0.0, 1.0, //12: Coin Bas Gauche
    2.0, 1.0, //13: Coin Bas Droit
    0.0, 0.0, //14: Coin Haut Gauche
    2.0, 0.0  //15: Coin Haut Droit
  ]);
  
  const couleursCylindre = new Float32Array([
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0
  ]);
  
  /**
   * @classdesc Objet qui représente une case mur
   */
  class ChestHaut extends Objet3D{
    /**
     * Créer un bloc de mur à la position (x, y) indiquée. Noter que la position y dénote la position y en 2D du mur dans
     * la grille de jeu et non son élévation en 3D.
     * @param x position x dans la grille de jeu
     * @param y position y  dans la grille de jeu
     */
    constructor (x, y) {

        let cylindreTopVertex = [];
        let divisions = 32;
        let theta = (Math.PI/180) * 360 / divisions;

        for(let i = 0; i <= divisions; i++){
            let x = Math.cos(theta*i);
            let z = Math.sin(theta*i);
            let y = 0;

            cylindreTopVertex.push(x, y+2, z);
        }

        const vertexCylindre = new Float32Array(cylindreTopVertex);
        console.log(vertexCylindre);

        let vertex = vertexCylindre;
    
        let maillage = new Maillage(maillageChest, 0, 8);
    
        let texels = new TexelColl(texelsChest, 5, 1.0);
    
        let transform = creerTransformations();
        setPositionsXYZ([x, 0, y], transform);
    
        let couleur = [];
    
        super(vertex, maillage, texels, transform, couleursChest);
    }
  }