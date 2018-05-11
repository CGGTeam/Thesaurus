/**
 * @classdesc Singleton qui contient l'instance d'audio
 */
class Sounds {
    constructor() {
        //initialise tout les audio files
        this.audioOuvrirMur = new Audio('docs/audio/ouvrirMur.wav');
        this.audioTresor = new Audio('docs/audio/tresor.wav');
        this.audioGameOver = new Audio('docs/audio/gameOver.wav');
        this.audioTeleport = new Audio('docs/audio/teleport.wav');
        this.audioWin = new Audio('docs/audio/win.wav');
        this.audioTimesUp = new Audio('docs/audio/timesUp.wav');
        this.audioLevelStart = new Audio('docs/audio/levelStart.wav');
    }
    /**
     * retourne l'instance d'audio
     */
    static getInstance() {
        if (!Audio.instance)
          Audio.instance = new Sounds();
        return Audio.instance;
    }
    playOuvrirMur(){
        this.audioOuvrirMur.currentTime = 0;
        this.audioOuvrirMur.play();
    }
    playTresor(){
        this.audioTresor.currentTime = 0;
        this.audioTresor.play();
    }
    playGameOver(){
        this.audioGameOver.currentTime = 0;
        this.audioGameOver.play();
    }
    playTeleport(){
        this.audioTeleport.currentTime = 0;
        this.audioTeleport.play();
    }
    playWin(){
        this.audioWin.currentTime = 0;
        this.audioWin.play();
    }
    playTimesUp(){
        this.audioTimesUp.currentTime = 0;
        this.audioTimesUp.play();
    }
    playLevelStart (){
        this.audioLevelStart.currentTime = 0;
        this.audioLevelStart.play();
    }
    /**
     * Change le volume de tout les audios au float passé en argument
     * @param {float} fltVolume 
     */
    changeVolume(fltVolume){
        this.audioOuvrirMur.volume = fltVolume;
        this.audioTresor.volume = fltVolume;
        this.audioGameOver.volume = fltVolume;
        this.audioTeleport.volume = fltVolume;
        this.audioWin.volume = fltVolume;
        this.audioTimesUp.volume = fltVolume;
        this.audioLevelStart.volume = fltVolume;
    }

}