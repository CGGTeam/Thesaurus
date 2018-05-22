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

var binAerien = false;
var anciennePosition = [];
var ancienneRotation = [];
var ancienneOrientation = [];
var indicateur;

var keys = [];
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

    if(!musDebutPlayed){
        Sounds.getInstance().playLevelStart ();
        musDebutPlayed = true;
    }

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
          //SI IL Y A ASSEZ DE POINTS
        if(Scene.getInstance().intScore >= 50){
            //si il lui rest des ouvreurs de murs
            if(Scene.getInstance().tabDessinables[0].intNbOuvreurs > 0)
                ouvrirMur();
            else{
                console.log('aucun n\'ouvreur restant');
            }
        }
        else
            console.log('Pas assez de points pour utilisier un ouvreur');
      }   
      else if(event.keyCode === 32){
        ouvrirMur();
      }
    }
    //pour tricher
    else{
        keys[event.keyCode] = true;
        if(keys[17] && keys[17] && keys[32]){
            console.log(' tricher' );
            Scene.getInstance().tabDessinables.filter(x => x instanceof Teletransporteur || x instanceof Fleche || x instanceof Chest)
            .forEach(obj => obj.binVisible = !obj.binVisible);
        }
    }
    if (event.keyCode === 33) {
        if(Scene.getInstance().intScore >= 10){
            binMoveLeft = false;
            binMoveRight = false;
            binMoveFoward = false;
            binMoveBackward = false;
            binAerien = !binAerien;
            Scene.getInstance().binOrthograpique = binAerien;
            toggleVueAerienne(binAerien);
        }
    }
});
/**
 * Gestion des KEYUP
 */
document.addEventListener("keyup", function(event) {


    keys[event.keyCode] = false;
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
            fltXPrime = intDirection*(fltVitesse-0.01) * ((fltX < 0) ? -1 : 1); fltZPrime = 0.0;
            fltZPrime = intDirection*(fltVitesse-0.01) * ((fltZ < 0) ? -1 : 1); fltXPrime = 0.0;

        // Nouvelles positions de la caméra
        fltXCamera = getPositionX(camera) + fltXPrime;
        fltZCamera = getPositionZ(camera) + fltZPrime;

        // Longer le mur s'il ne rencontre pas un nouveau mur
        if (checkCollision(fltXCamera,fltZCamera)) {
            setCibleCameraX(getCibleCameraX(camera) + fltXPrime, camera);
            setCibleCameraZ(getCibleCameraZ(camera) + fltZPrime, camera);
            setPositionCameraX(getPositionCameraX(camera) + fltXPrime, camera);
            setPositionCameraZ(getPositionCameraZ(camera) + fltZPrime, camera);
        }
    }
}

/**
 * @param {float} fltX 
 * @param {float} fltZ 
 * return true si il y a pas de collision, false si il en a une
 */
function checkCollision(fltX,fltZ){
    binAucuneCollision = true;
    let fltPaddingSize = 0.2; //ajout d'un padding pour empecher que la camera puisse voir à travers les murs
    grille = Scene.getInstance().tabDessinables[0].grille;

    intXPlus = Math.floor((fltX+fltPaddingSize));
    intZPlus = Math.floor((fltZ+fltPaddingSize));

    intXMinus = Math.floor((fltX-fltPaddingSize));
    intZMinus = Math.floor((fltZ-fltPaddingSize));

    if(grille[intZMinus][intXMinus]!=null){
        if(grille[intZMinus][intXMinus].constructor.name == "MurOuvrable"){
            if(!grille[intZMinus][intXMinus].ouvert)
                binAucuneCollision = false;
        }
        else if(grille[intZMinus][intXMinus].constructor.name == "MurImbrisable"){
                binAucuneCollision = false;
        }
    }
    if(grille[intZPlus][intXPlus]!=null){
        if(grille[intZPlus][intXPlus].constructor.name == "MurOuvrable"){
            if(!grille[intZPlus][intXPlus].ouvert)
                binAucuneCollision = false;
        }
        else if(grille[intZPlus][intXPlus].constructor.name == "MurImbrisable"){
                binAucuneCollision = false;
        }
    }

    Scene.getInstance().tabDessinables.filter(obj => obj instanceof Teletransporteur).forEach(transporteur => {
        if(transporteur.transporteur &&
            fltX < transporteur.x + 0.125 && fltX > transporteur.x - 0.125 && fltZ < transporteur.y + 0.125 && fltZ > transporteur.y - 0.125){
                
                let tTempo = Scene.getInstance().tabDessinables.filter(x => x instanceof Teletransporteur && !x.transporteur);
                let recepteur = tTempo[Math.floor(Math.random()*tTempo.length)];
                console.log(recepteur);
                setPositionsCameraXYZ([recepteur.x + (binMoveLeft ? 0.125 : (binMoveRight ? -0.125 : 0)),1,
                    recepteur.y + (binMoveFoward ? 0.125 : (binMoveBackward ? -0.125 : 0))], 
                Scene.getInstance().camera);
                Sounds.getInstance().playTeleport();
        }
    });
    Scene.getInstance().tabDessinables.filter(obj => obj instanceof Chest).forEach(chest => {
        if(intXPlus < chest.x + 0.125 && intXPlus > chest.x - 0.125 && intZPlus < chest.y + 0.125 && intZPlus > chest.y - 0.125){
            Scene.getInstance().tabDessinables[0].levelCompleted();
        }
    });
    

    return binAucuneCollision;
}
/**
 * Regarde si la camera est à l'extérieur de l'enclos et la ferme si elle l'est
 * @param {float} fltZ
 */
function checkExterieurEnclos(fltZ){
    if(fltZ<=12.5){
        console.log('ferme')
        binClosed = true;

        let objCtor = tabCodeGrille[2];
        let fctFactory = objCtor.bind(objCtor, 15, 13);
        let objCase = new fctFactory();
        Scene.getInstance().tabDessinables[0].grille[13][15] = objCase;

        tabMursImbrisables.push(objCase);
    }
}
/**
 * ouvre un mur ouvrable dans la direction que le joueur fait fasse
 */
function ouvrirMur(){
    let camera = Scene.getInstance().camera;

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
            Scene.getInstance().tabDessinables[0].grille[intZCamera][intXCamera].ouvert = true;
            Scene.getInstance().tabDessinables[0].intNbOuvreurs--;
            Sounds.getInstance().playOuvrirMur();
            Scene.getInstance().intScore -= 50;
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
    Scene.getInstance().tabDessinables.filter(x => x instanceof Teletransporteur || x instanceof Fleche || x instanceof Chest)
        .forEach(obj => obj.binVisible = false);
  } else {
    setPositionsXYZ(anciennePosition,camera);
    setCiblesCameraXYZ(ancienneRotation, camera);
    setOrientationsXYZ(ancienneOrientation, camera);
    Scene.getInstance().removeDessinable(indicateur);
    Scene.getInstance().tabDessinables.filter(x => x instanceof Teletransporteur || x instanceof Fleche || x instanceof Chest)
        .forEach(obj => obj.binVisible = true);
  }

  Scene.getInstance().tabDessinables[0].plafond.binVisible = !binAerien;
}