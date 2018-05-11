/**
 * Controller pour la gestion des mouvements
 * A noter que ixi les X, Y, Z représente les axes dans un plan 3D
 */
var binMoveLeft = false;
var binMoveRight = false;
var binMoveFoward = false;
var binMoveBackward = false;
var binClosed = false;
var fltVitesse = 0.045; //0.045;
var nbOuvreurs = 4;

var binAerien = false;
var anciennePosition = [];
var ancienneRotation = [];
var ancienneOrientation = [];
var indicateur;
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
    if (!binAerien) {
      if (event.keyCode === 37){
        binMoveLeft = true;
      }
      //fleche droite
      else if(event.keyCode === 39){
        binMoveRight = true;
      }
      //fleche en haut
      else if(event.keyCode === 38){
        binMoveFoward = true;
        event.preventDefault();
      }
      //fleche en bas
      else if(event.keyCode === 40){
        binMoveBackward = true;
        event.preventDefault();
      }
      //space (ouvrir un mur)
      else if(event.keyCode === 32){
        if(nbOuvreurs >= 0)
            ouvrirMur();
        else{
            console.log('aucun n\'ouvreur restant');
        }
      }
      else if(event.keyCode === 32){
        ouvrirMur();
      }
    }
    if (event.keyCode === 33) {
      binMoveLeft = false;
      binMoveRight = false;
      binMoveFoward = false;
      binMoveBackward = false;
      binAerien = !binAerien;
      Scene.getInstance().binOrthograpique = binAerien;
      toggleVueAerienne(binAerien);
    }
});
/**
 * Gestion des KEYUP
 */
document.addEventListener("keyup", function(event) {
    if (!binAerien) {
      //fleche gauche
      if (event.keyCode === 37){
        binMoveLeft = false;
      }
      //fleche droite
      else if(event.keyCode === 39){
        binMoveRight = false;
      }
      //fleche en haut
      else if(event.keyCode === 38){
        binMoveFoward = false;
      }
      //fleche en bas
      else if(event.keyCode === 40){
        binMoveBackward = false;
      }
    }
});

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
    let fltAngle = intDirection * Math.PI / (fltVitesse * 3500); // Tourner 2 degrés
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
    let fltXPrime = intDirection * fltVitesse * Math.cos(Math.acos(fltX / fltRayon));
    let fltZPrime = intDirection * fltVitesse * Math.sin(Math.asin(fltZ / fltRayon));

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
/**
 * Regarde si la camera est à l'extérieur de l'enclos et la ferme si elle l'est
 * @param {float} fltZ
 */
function checkExterieurEnclos(fltZ){
    if(fltZ<=12.5){
        binClosed = true;;

        let objCtor = tabCodeGrille[2];
        let fctFactory = objCtor.bind(objCtor, 15, 13);
        Scene.getInstance().tabDessinables[0].grille[13][15] = new fctFactory();
    }
}
/**
 * ouvre un mur ouvrable dans la direction que le joueur fait fasse
 */
function ouvrirMur(){
    camera = Scene.getInstance().camera;

    //la direction que la camera fait face
    let fltX = getCibleCameraX(camera) - getPositionCameraX(camera);
    let fltZ = getCibleCameraZ(camera) - getPositionCameraZ(camera);

    //la position de la camera
    let intXCamera = Math.floor(getPositionX(camera));
    let intZCamera = Math.floor(getPositionZ(camera));

    //nord
    if(fltZ<=-1 && fltX>=-1 && fltX<=1){
        intZCamera=intZCamera-1;
    }
    //sud
    else if(fltZ>=1 && fltX>=-1 && fltX<=1){
        intZCamera=intZCamera+1;
    }
    //est
    else if(fltZ>=-1 && fltZ<=1 && fltX>=1){
        intXCamera=intXCamera+1;
    }
    //ouest
    else{
        intXCamera=intXCamera-1;
    }
    try{
        //regarde si l'objet est un mur ouvrable
        if((Scene.getInstance().tabDessinables[0].grille[intZCamera][intXCamera].constructor.name == "MurOuvrable")){
            //enlever l'objet dans la grille et enlever 1 ouvreur
            Scene.getInstance().tabDessinables[0].grille[intZCamera][intXCamera] = null;
            nbOuvreurs--;
        }
        else
            console.log('Vous ne pouvez pas ouvrir un' + (Scene.getInstance().tabDessinables[0].grille[intZCamera][intXCamera].constructor.name))
    }catch(e){console.log('Vous faites face à aucun objet')}
}

function toggleVueAerienne(binAerien){
  let camera = Scene.getInstance().camera;
  if (binAerien) {
    anciennePosition = getPositionsCameraXYZ(camera);
    ancienneOrientation = getOrientationsXYZ(camera);
    ancienneRotation = getCiblesCameraXYZ(camera);

    let p1 = {
      x: getPositionCameraX(camera),
      y: getPositionCameraZ(camera)
    };

    let p2 = {
      x: getCibleCameraX(camera),
      y: getCibleCameraZ(camera)
    };

    let angleDeg = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI + 90;

    setPositionsCameraXYZ([15.50, 40, 15.50],camera);
    setCiblesCameraXYZ([15.50,0,15.50], camera);
    setOrientationsXYZ([0, 0, -1], camera);

    let transformIndicateur = creerTransformations();
    setPositionsXYZ(anciennePosition, transformIndicateur);
    setAngleY(-angleDeg, transformIndicateur);
    indicateur = new Indicateur(transformIndicateur);
    Scene.getInstance().addDessinable(indicateur);
  } else {
    setPositionsXYZ(anciennePosition,camera);
    setCiblesCameraXYZ(ancienneRotation, camera);
    setOrientationsXYZ(ancienneOrientation, camera);
    Scene.getInstance().removeDessinable(indicateur);
  }
}
