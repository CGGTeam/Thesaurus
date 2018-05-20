const vertexMur = creeTabVertexCylindre();

const maillageMur = new Maillage(new Uint16Array([
    //Face Avant
    2, 1, 0,
    1, 2, 3,
    //Face Arrière
    4, 5, 6,
    7, 6, 5,
    //Face Gauche
    10, 9, 8,
    9, 10, 11,
    //Face Droite
    12, 13, 14,
    15, 14, 13,
    //Face Haute
    18, 17, 16,
    17, 18, 19
]), 0, 10);

const texelsMur = new Float32Array([
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
    1.0, 0.0, //15: Coin Haut Droit

    //Face haute
    0.0, 2.0, //12: Coin Bas Gauche
    1.0, 2.0, //13: Coin Bas Droit
    0.0, 0.0, //14: Coin Haut Gauche
    1.0, 0.0  //15: Coin Haut Droit
]);

const texCollOuvrable = new TexelColl(texelsMur, 0, 1.0);

const couleursMurs = new Float32Array([
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
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0
]);

/**
 * @classdesc Objet qui représente une case mur
 */
class MurOuvrable {
    /**
     * Créer un bloc de mur à la position (x, y) indiquée. Noter que la position y dénote la position y en 2D du mur dans
     * la grille de jeu et non son élévation en 3D.
     * @param x position x dans la grille de jeu
     * @param y position y  dans la grille de jeu
     */
    constructor (x, y) {
        this.ouvert = false;

        this.transform = creerTransformations();
        setPositionsXYZ([x, 0, y], this.transform);
    }
}
function creeTabVertexCylindre() {
    var tabVertex = [0, 0, 0] // Le centre du cercle
    for (var i = 0; i <= 360; i++) {
        tabVertex = tabVertex.concat([Math.cos(i * Math.PI / 180), 0.0, Math.sin(i * Math.PI / 180)]);
    }

    for (var i = 0; i <= 360; i++) {
        tabVertex = tabVertex.concat([Math.cos(i * Math.PI / 180), 2.0, Math.sin(i * Math.PI / 180)]);
    }
}
