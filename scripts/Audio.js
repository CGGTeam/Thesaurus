/**
 * @classdesc Singleton qui contient l'instance d'audio
 */
class Audio {
    constructor() {
        this.audioOuvrirMur = new Audio('../docs/audio/ouvrirMur.wav');
    }
    static getInstance() {
        if (!Audio.instance)
          Audio.instance = new Audio();
        return Audio.instance;
    }
    playOuvrirMur(){
        console.log('play ouvrirMur.wav')
        this.audioFall.play();
    }
}