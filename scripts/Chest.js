class Chest extends Dessinable{
        constructor(a,b){
                super();
                this.chestBas = new ChestBas(a+0.5,b+0.5);
                this.chestHaut = new ChestHaut(a+0.5,b+0.5);
                this.x = a;
                this.y = b;
        }

        dessiner(){
                this.chestBas.dessiner();
                this.chestHaut.dessiner();
        }

                
        static getInstance(a, b) {
                if (!Chest.instance && a && b)
                        Chest.instance = new Chest(a, b);
                return Chest.instance;
        }
} 