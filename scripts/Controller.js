/**
 * Controller pour la gestion des mouvements
 * A noter que ixi les X, Y, Z représente les axes dans un plan 3D
 */
var binMoveLeft = false;
var binMoveRight = false;
var binMoveFoward = false;
var binMoveBackward = false;
var binClosed = false;

/**
 * Si la page est out of focus, mettre tout a false
 */
window.onblur = function(){  
    binMoveLeft = false;
    binMoveRight = false;
    binMoveFoward = false;
    binMoveBackward = false;
  }  
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
        event.preventDefault();
    }
    //fleche en bas
    else if(event.keyCode == 40){
        binMoveBackward = true;
        event.preventDefault();
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
 * Cette fonction est appellé par le requestAnimationFrame et permet le déplacment du character
 */
function updatePosCamera(){
    if(binMoveRight){
        rotateCamera(1);
    }
    if(binMoveLeft){
        rotateCamera(-1);
    }
    if(binMoveFoward){
        moveCamera(1);
    }
    if(binMoveBackward){
        moveCamera(-1);
    }
}

/**
 * Rotate la camera de facon circulaire
 * @param intDirection
 */
function rotateCamera(intDirection){
    camera = Scene.getInstance().camera;
    let fltX = getCibleCameraX(camera) - getPositionCameraX(camera);
    let fltZ = getCibleCameraZ(camera) - getPositionCameraZ(camera);
    let fltAngle = intDirection * Math.PI / 90; // Tourner 2 degrés
    let fltXPrime = fltX * Math.cos(fltAngle) - fltZ * Math.sin(fltAngle);
    let fltZPrime = fltX * Math.sin(fltAngle) + fltZ * Math.cos(fltAngle);
    setCibleCameraX(getPositionCameraX(camera) + fltXPrime, camera);
    setCibleCameraZ(getPositionCameraZ(camera) + fltZPrime, camera);
}

/**
 * Déplace la caméra de facon horizontal
 * @param intDirection
 */
function moveCamera(intDirection){
    camera = Scene.getInstance().camera;
    let fltX = getCibleCameraX(camera) - getPositionCameraX(camera);
    let fltZ = getCibleCameraZ(camera) - getPositionCameraZ(camera);
    let fltRayon = Math.sqrt(fltX * fltX + fltZ * fltZ);
    let fltXPrime = intDirection * 0.075 * Math.cos(Math.acos(fltX / fltRayon));
    let fltZPrime = intDirection * 0.075 * Math.sin(Math.asin(fltZ / fltRayon));

    // Positions de la caméra
    let fltXCamera = getPositionX(camera) + fltXPrime;
    let fltZCamera = getPositionZ(camera) + fltZPrime;

    //si il n'y a pas de collision
    if(checkCollision(fltXCamera,fltZCamera)){ 
        // Déplacer la caméra
        setCibleCameraX(getCibleCameraX(camera) + fltXPrime, camera);
        setCibleCameraZ(getCibleCameraZ(camera) + fltZPrime, camera);
        setPositionCameraX(getPositionCameraX(camera) + fltXPrime, camera);
        setPositionCameraZ(getPositionCameraZ(camera) + fltZPrime, camera);

        //si le joueur sort de l'enclos du début, elle doit se fermer
        if(binClosed == false){
            checkExterieurEnclos(fltZCamera)
        }
    }
    else { // Pour longer les murs s'il y a une collision
    /*
        if (fltZCamera <=  Math.floor((fltZCamera)) || fltZCamera >= Math.floor((fltZCamera))) {
            // On longe les mur ouest ou est 
            console.log('Z')
            fltXPrime = 0.06 * ((fltX < 0) ? -1 : 1); 
            fltZPrime = 0.0;
        }
        else if (fltXCamera <=  Math.floor((fltXCamera)) || fltXCamera >= Math.floor((fltXCamera))) {
            // On longe les mur sud ou nord 
            console.log('X')
            fltZPrime = 0.06 * ((fltZ < 0) ? -1 : 1); 
            fltXPrime = 0.0;
        }

        // Nouvelles positions de la caméra
        fltXCamera = getPositionX(camera) + fltXPrime;
        fltZCamera = getPositionZ(camera) + fltZPrime;

        // Longer le mur s'il ne rencontre pas un nouveau mur
        if (checkCollision(fltX,fltZ)) {
            setCibleCameraX(getCibleCameraX(camera) + fltXPrime, camera);
            setCibleCameraZ(getCibleCameraZ(camera) + fltZPrime, camera);
            setPositionCameraX(getPositionCameraX(camera) + fltXPrime, camera);
            setPositionCameraZ(getPositionCameraZ(camera) + fltZPrime, camera);
        }
        */
    }
}

/**
 * @param {float} fltX 
 * @param {float} fltZ 
 * return true si il y a pas de collision, false si il en a une
 */
function checkCollision(fltX,fltZ){
    binAucuneCollision = true;
    let fltPaddingSize = 0.25; //ajout d'un padding pour empecher que la camera puisse voir à travers les murs
    grille = Scene.getInstance().tabDessinables[0].grille;

    intXPlus = Math.floor((fltX+fltPaddingSize));
    intZPlus = Math.floor((fltZ+fltPaddingSize));

    intXMinus = Math.floor((fltX-fltPaddingSize));
    intZMinus = Math.floor((fltZ-fltPaddingSize));

    /**
     * si grille[intZ][intX].constructor.name retourne une erreur c'est qu'il n'y a aucun objet a intZ et intX
     * et donc c'est marchable
    */
    try{
        if(grille[intZMinus][intXMinus].constructor.name){
            binAucuneCollision = false;
        }
    }catch(e){}
    try{
        if(grille[intZPlus][intXPlus].constructor.name){
            binAucuneCollision = false;
        }
    }catch(e){}
    return binAucuneCollision;
}
function checkExterieurEnclos(fltZ){
    if(fltZ<=12.5){
        binClosed = true;;

        let objCtor = tabCodeGrille[2];
        let fctFactory = objCtor.bind(objCtor, 15, 13);
        Scene.getInstance().tabDessinables[0].grille[13][15] = new fctFactory();
    }
}