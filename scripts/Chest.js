class Chest extends Dessinable{
        constructor(x,y){
                super();
                this.chestBas = new ChestBas(x,y);
                //this.chestHaut = new ChestHaut(x,y);
        }

        dessiner(){
                this.chestBas.dessiner();
                //this.chestHaut.dessiner();
        }
}