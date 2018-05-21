class Chest extends Dessinable{
        constructor(a,b){
                super();
                this.chestBas = new ChestBas(a+0.5,b+0.5);
                this.chestHaut = new ChestHaut(a+0.5,b+0.5);
                this.x = a;
                this.y = b;
                this.binVisible = true;
        }

        dessiner(){
                if (this.binVisible){
                        this.chestBas.maillage.nbTriangles = 8;
                        this.chestHaut.maillage.nbTriangles = this.chestHaut.nbTriangles;
                }
                else{
                        this.chestBas.maillage.nbTriangles = 0;
                        this.chestHaut.maillage.nbTriangles = 0;
                }
          
                this.chestBas.dessiner();
                this.chestHaut.dessiner();
        }

                
        static getInstance(a, b) {
                if (!Chest.instance && a && b)
                        Chest.instance = new Chest(a, b);
                return Chest.instance;
        }
        static getX(){
                return this.x;
        }
        static getY(){
                return this.y;
        }
} 