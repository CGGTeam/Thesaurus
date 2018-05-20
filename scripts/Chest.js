class Chest extends Dessinable{
        constructor(a,b){
                super();
                this.chestBas = new ChestBas(a,b);
                this.chestHaut = new ChestHaut(a,b);
        }

        dessiner(){
                this.chestBas.dessiner();
                this.chestHaut.dessiner();
        }
}