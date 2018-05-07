class Chest extends Objet3D {
    constructor(scene, vertex, typeDessin, maillage, texels, transformation, couleurs=[]){
        super(scene, vertex, typeDessin, maillage, texels, transformation, couleurs=[]);

        // Mettre les textures dans la scène
        objScene3D.textures = creerTextures(objgl, ['Transparent.gif', 'Metal.jpg']);

        this.createChest();
        this.createTexelsChest();
    }
    /**
     * Places the object inside the level
     */
    placeInLevel(x,y){

    }
    /**
     * Créer le tableau de vertex
     */
    createChest(){
        var tabVertex = new Array();
        // Face avant pleine
        tabVertex[0] = [
                0.0, 0.0, 1.0, // Centre du plan 
                1.0, 1.0, 1.0,
                -1.0, 1.0, 1.0,
                -1.0, -1.0, 1.0,
                1.0, -1.0, 1.0,
                1.0, 1.0, 1.0
                ];

        // Face arrère pleine
        tabVertex[1] = [
                0.0, 0.0, -1.0, // Centre du plan
                1.0, 1.0, -1.0,
                -1.0, 1.0, -1.0,
                -1.0, -1.0, -1.0,
                1.0, -1.0, -1.0,
                1.0, 1.0, -1.0
        ];

        // Face du dessus pleine
        tabVertex[2] = [
                0.0, 1.0, 0.0, // Centre du plan
                1.0, 1.0, 1.0,
                -1.0, 1.0, 1.0,
                -1.0, 1.0, -1.0,
                1.0, 1.0, -1.0,
                1.0, 1.0, 1.0
        ];

        // Face du dessous pleine
        tabVertex[3] = [
                0.0, -1.0, 0.0, // Centre du plan
                1.0, -1.0, 1.0,
                -1.0, -1.0, 1.0,
                -1.0, -1.0, -1.0,
                1.0, -1.0, -1.0,
                1.0, -1.0, 1.0
        ];

        // Face de droite pleine
        tabVertex[4] = [
                1.0, 0.0, 0.0, // Centre du plan
                1.0, 1.0, 1.0,
                1.0, -1.0, 1.0,
                1.0, -1.0, -1.0,
                1.0, 1.0, -1.0,
                1.0, 1.0, 1.0
        ];

        // Face de gauche pleine
        tabVertex[5] = [
                -1.0, 0.0, 0.0, // Centre du plan
                -1.0, 1.0, 1.0,
                -1.0, -1.0, 1.0,
                -1.0, -1.0, -1.0,
                -1.0, 1.0, -1.0,
                -1.0, 1.0, 1.0
        ];

        // Contour avant
        tabVertex[6] = [
                1.0, 1.0, 1.0,
                -1.0, 1.0, 1.0,
                -1.0, -1.0, 1.0,
                1.0, -1.0, 1.0
        ];

        // Contour arrière
        tabVertex[7] = [
                1.0, 1.0, -1.0,
                -1.0, 1.0, -1.0,
                -1.0, -1.0, -1.0,
                1.0, -1.0, -1.0
        ];

        // Droites reliées aux 2 faces
        tabVertex[8] = [
                1.0, 1.0, -1.0, 1.0, 1.0, 1.0,
                -1.0, 1.0, -1.0, -1.0, 1.0, 1.0,
                1.0, -1.0, -1.0, 1.0, -1.0, 1.0,
                -1.0, -1.0, -1.0, -1.0, -1.0, 1.0
        ];

        this.vertex = tabVertex;
        /*

        // Création des tampons
        var tabObjCube = new Array();
        for (var i = 0; i < 9; i++) {
            tabObjCube[i] = objgl.createBuffer();
            objgl.bindBuffer(objgl.ARRAY_BUFFER, tabObjCube[i]);
            objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabVertex[i]), objgl.STATIC_DRAW);
            tabObjCube[i].typeDessin = (i < 6) ? objgl.TRIANGLE_FAN : ((i < 8) ? objgl.LINE_LOOP : objgl.LINES);
        }
        
        return tabObjCube;
        */
    }
    /**
     * Créer le tableau de texel
     */
    createTexelsChest() {
        var tabTexels = new Array();

        // Texels de la face avant
        tabTexels[0] = [
                          0.5, 0.5,
                          1.0, 0.0,
                          0.0, 0.0,
                          0.0, 1.0,
                          1.0, 1.0,
                          1.0, 0.0
                          ];
 
        // Texels de la face arrière
        tabTexels[1] = tabTexels[0];

        // Texels de la face avant, de la face arrière et des arêtes
        tabTexels[2] = [];
        for (var i = 0; i < 4; i++)
            tabTexels[2] = tabTexels[2].concat([0.0, 1.0]); // Pas de texture
        tabTexels[3] = tabTexels[2]; // Pas de textures
        tabTexels[4] = tabTexels[2].concat(tabTexels[2]); // Pas de textures
      
        var tabTexelsChest = new Array();
        for (var i = 0; i < 5; i++) {
                tabTexelsChest[i] = objgl.createBuffer();
            objgl.bindBuffer(objgl.ARRAY_BUFFER, tabTexelsChest[i]);
            objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabTexels[i]), objgl.STATIC_DRAW);

            if (i < 2) {
                tabTexelsChest[i].intNoTexture = TEX_METAL; tabTexelsChest[i].pcCouleurTexel = 1.0;
            }
            else {
                tabTexelsChest[i].intNoTexture = TEX_TRANSPARENT; tabTexelsChest[i].pcCouleurTexel = 0;
            }
        }
        
        this.texels = tabTexelsChest;
    }
}