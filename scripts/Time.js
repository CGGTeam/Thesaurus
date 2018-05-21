
function startTimer(duration) {
    var interval;
    var start = Date.now(),
        diff,
        minutes,
        seconds;
    function timer() {
        diff = duration - (((Date.now() - start) / 1000) | 0);

        Scene.getInstance().setTime(diff, duration);

        if (diff < 0) {
            start = Date.now() + 1000;
            //recommence le niveau
            if( Scene.getInstance().intScore >=200){
                Scene.getInstance().tabDessinables[0].outOfTime();
                
            }
            //plus assez de points pour recommencer
            else{
                Scene.getInstance().tabDessinables[0].gameOver();
                clearInterval(interval);
            }
        }
        
    };
    timer();
    interval = setInterval(timer, 60);
}