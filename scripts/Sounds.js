/**
 * @classdesc Singleton qui contient l'instance d'audio
 */
class Sounds {
    constructor() {
        //initialise tout les audio files
        this.audioOuvrirMur = new Audio('docs/audio/ouvrirMur.wav');
        this.audioTresor = new Audio('docs/audio/tresor.wav');
    }
    /**
     * retourne l'instance d'audio
     */
    static getInstance() {
        if (!Audio.instance)
          Audio.instance = new Sounds();
        return Audio.instance;
    }
    /**
     * joue l'audio d'ouvrir un mur
     */
    playOuvrirMur(){
        this.audioOuvrirMur.currentTime = 0;
        this.audioOuvrirMur.play();
    }
    /**
     * joue l'audio de ramasser le tresor
     */
    playTresor(){
        this.audioTresor.currentTime = 0;
        this.audioTresor.play();
    }
}