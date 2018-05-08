/**
 * Controller pour la gestion des mouvements
 */
var binMoveLeft = false;
var binMoveRight = false;
var binMoveFoward = false;
var binMoveBackward = false;

/**
 * gestion des KEYDOWN
 */
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
/**
 * Gestion des KEYUP
 */
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

/**
 * Cette fonction est appellé par le requestAnimation frame et permet le déplacment du character
 * @param camera
 */
function updatePosCamera(camera){
    if(binMoveRight){
        rotateCamera(camera,1);
    }
    if(binMoveLeft){
        rotateCamera(camera,-1);
    }
    if(binMoveFoward){
        moveCamera(camera,1);
    }
    if(binMoveBackward){
        moveCamera(camera,-1);
    }
}

/**
 * Rotate la camera de facon circulaire
 * @param camera
 * @param intDirection
 */
function rotateCamera(camera,intDirection){
    let fltX = getCibleCameraX(camera) - getPositionCameraX(camera);
    let fltZ = getCibleCameraZ(camera) - getPositionCameraZ(camera);
    let fltAngle = intDirection * Math.PI / 180; // Tourner 1 degrés
    let fltXPrime = fltX * Math.cos(fltAngle) - fltZ * Math.sin(fltAngle);
    let fltZPrime = fltX * Math.sin(fltAngle) + fltZ * Math.cos(fltAngle);
    setCibleCameraX(getPositionCameraX(camera) + fltXPrime, camera);
    setCibleCameraZ(getPositionCameraZ(camera) + fltZPrime, camera);
}

/**
 * Déplace la caméra de facon horizontal
 * @param camera
 * @param intDirection
 */
function moveCamera(camera,intDirection){
    let fltX = getCibleCameraX(camera) - getPositionCameraX(camera);
    let fltZ = getCibleCameraZ(camera) - getPositionCameraZ(camera);
    let fltRayon = Math.sqrt(fltX * fltX + fltZ * fltZ);
    let fltXPrime = intDirection * 0.075 * Math.cos(Math.acos(fltX / fltRayon));
    let fltZPrime = intDirection * 0.075 * Math.sin(Math.asin(fltZ / fltRayon));

    // Positions de la caméra
    let fltXCamera = getPositionX(camera) + fltXPrime;
    let fltZCamera = getPositionZ(camera) + fltZPrime;

    // Déplacer la caméra
    setCibleCameraX(getCibleCameraX(camera) + fltXPrime, camera);
    setCibleCameraZ(getCibleCameraZ(camera) + fltZPrime, camera);
    setPositionCameraX(getPositionCameraX(camera) + fltXPrime, camera);
    setPositionCameraZ(getPositionCameraZ(camera) + fltZPrime, camera);
}