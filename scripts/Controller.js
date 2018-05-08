/**
 * Controller pour la gestion des mouvements
 */
var binMoveLeft = false;
var binMoveRight = false;
var binMoveFoward = false;
var binMoveBackward = false;
var camera = null;

//Gestion des keydown
document.addEventListener("keydown", function(event) {
    //fleche gauche
    if (event.keyCode == 37){
        binMoveLeft = true;
    }
    //fleche droite
    else if(event.keyCode == 39){
        binMoveRight = true;
    }
    //fleche en haut
    else if(event.keyCode == 38){
        binMoveFoward = true;
    }
    //fleche en bas
    else if(event.keyCode == 40){
        binMoveBackward = true;
    }
})
//Gestion des keyup
document.addEventListener("keyup", function(event) {
    //fleche gauche
    if (event.keyCode == 37){
        binMoveLeft = false;
    }
    //fleche droite
    else if(event.keyCode == 39){
        binMoveRight = false;
    }
    //fleche en haut
    else if(event.keyCode == 38){
        binMoveFoward = false;
    }
    //fleche en bas
    else if(event.keyCode == 40){
        binMoveBackward = false;
    }
})
function moveCamera(camera){
    if(binMoveRight){
        rotateCamera(camera,1);
    }
    if(binMoveLeft){
        rotateCamera(camera,-1);
    }
    if(binMoveFoward){
        
    }
    if(binMoveBackward){
        
    }
}
function rotateCamera(camera,intDirection){
    let fltX = getCibleCameraX(camera) - getPositionCameraX(camera);
    let fltZ = getCibleCameraZ(camera) - getPositionCameraZ(camera);
    let fltAngle = intDirection * Math.PI / 180; // Tourner 2 degrés
    let fltXPrime = fltX * Math.cos(fltAngle) - fltZ * Math.sin(fltAngle);
    let fltZPrime = fltX * Math.sin(fltAngle) + fltZ * Math.cos(fltAngle);
    setCibleCameraX(getPositionCameraX(camera) + fltXPrime, camera);
    setCibleCameraZ(getPositionCameraZ(camera) + fltZPrime, camera);
}