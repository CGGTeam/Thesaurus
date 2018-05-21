

  
  
  /**
   * @classdesc Objet qui représente un coffre
   */
  class ChestHaut extends Objet3D{
    /**
     * Créer un bloc de mur à la position (x, y) indiquée. Noter que la position y dénote la position y en 2D du chest dans
     * la grille de jeu et non son élévation en 3D.
     * @param x position x dans la grille de jeu
     * @param y position y  dans la grille de jeu
     */ 
    constructor (x, y) {

        let cylindreTopVertex = [0,0,0,
                                 0,0,0.5];
        let cylindreTopMaillage = [];
        let divisions = 32;
        let theta = (Math.PI/180) * 360 / divisions;
        let a = Math.cos(theta)/4;
        let b = Math.sin(theta)/4;
        cylindreTopVertex.push(a, b, 0);
        cylindreTopVertex.push(a, b, 0.5);

        for(let i = 2; i <= divisions+2; i++){
          a = Math.cos(theta*i)/4;
          b = Math.sin(theta*i)/4;
          cylindreTopVertex.push(a, b, 0);
          cylindreTopVertex.push(a, b, 0.5);
          //if(i < 3){
          cylindreTopMaillage.push(
            0, i, (i-2),
            1, i, (i-1),
            i, (i-2), (i+1),
            i, (i-1), (i+1)
          );//}
        }
        console.log(cylindreTopVertex);
        console.log(cylindreTopMaillage);
        const vertexCylindre = new Float32Array(cylindreTopVertex);
        const maillageCylindre = new Uint16Array(cylindreTopMaillage);
        //console.log(vertexCylindre);
        //console.log(maillageCylindre)

        let texelsCylindre = new Float32Array((new Array(cylindreTopVertex.length/3*2).fill(0.0)));

        let vertex = vertexCylindre;
    
        let maillage = new Maillage(maillageCylindre, 0, divisions*4);
    
        let texels = new TexelColl(texelsCylindre, 5, 1.0);
    
        let transform = creerTransformations();
        setPositionsXYZ([x, 0.2, y], transform);

        let couleursCylindre = [];
        for(let i = 0; i < (divisions + 1) * 2; i++){
          couleursCylindre.push(0.0,0.0,0.0,1.0);
        }

        super(vertex, maillage, texels, transform, new Float32Array(couleursCylindre));
        this.nbTriangles = divisions * 4;
    }
  }