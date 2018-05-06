class Chest extends Objet3D {
    constructor(scene, vertex, typeDessin, maillage, texels, transformation, couleurs=[], x, y){
        super(scene, vertex, typeDessin, maillage, texels, transformation, couleurs=[]);
        placeInLevel(x,y);
    }
    /**
     * placeInLevel
     * Places the object inside the 
     */
    placeInLevel(x,y){

    }
}