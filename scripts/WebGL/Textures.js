// Textures.js
let compteurTexturesChargees = 0;
const adresseServeur = 'https://cggteam.github.io/Thesaurus/textures/';
function creerTextures(objgl, tabImages, callback, thisarg) {
    let tabObjTextures = [];
    for (let i = 0; i < tabImages.length; i++) {
      // L'image de la texture
      let objImage = new Image();
      objImage.crossOrigin = "";
      objImage.onload = () => textureChargee(objgl, objImage,tabImages.length, callback, thisarg, tabObjTextures);
      objImage.src = adresseServeur + tabImages[i];
    }
}

function textureChargee(objgl, objImage, valeurVisee, callback, thisarg, tabTextures) {
    // Créer La texture
    let objTexture = objgl.createTexture();

    // La sélectionner
    objgl.bindTexture(objgl.TEXTURE_2D, objTexture);

    // Insérer l'image à l'intérieur de la texture
    objgl.texImage2D(objgl.TEXTURE_2D, 0, objgl.RGBA, objgl.RGBA,
      objgl.UNSIGNED_BYTE, objImage);

    // La paramétrer
    objgl.texParameteri(objgl.TEXTURE_2D, objgl.TEXTURE_MAG_FILTER, objgl.NEAREST);
    objgl.texParameteri(objgl.TEXTURE_2D, objgl.TEXTURE_MIN_FILTER, objgl.NEAREST)

    objgl.texParameteri(objgl.TEXTURE_2D, objgl.TEXTURE_WRAP_S, objgl.CLAMP_TO_EDGE);
    objgl.texParameteri(objgl.TEXTURE_2D, objgl.TEXTURE_WRAP_T, objgl.CLAMP_TO_EDGE);

    // Insérer cette texture dans un tableau de textures
    tabTextures.push(objTexture);

    compteurTexturesChargees++;
    if (compteurTexturesChargees >= valeurVisee)
        callback.call(thisarg, tabTextures);
}
