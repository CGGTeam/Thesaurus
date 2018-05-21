// Textures.js
let compteurTexturesChargees = 0;
const adresseServeur = 'https://cggteam.github.io/Thesaurus/textures/';
function chargerImages(tabImages, callback, thisarg) {
    let tabImgLoaded = [];
    for (let i = 0; i < tabImages.length; i++) {
      // L'image de la texture
      let objImage = new Image();
      objImage.crossOrigin = "";
      tabImgLoaded.push(objImage);
      objImage.onload = () => textureChargee(tabImages.length, tabImgLoaded);
      objImage.src = adresseServeur + tabImages[i];
    }
}

function textureChargee(valeurVisee, tabImages) {
    compteurTexturesChargees++;
    if (compteurTexturesChargees >= valeurVisee)
        initialiserScene(tabImages);
}

function creerTextures(objgl, tabImages) {
  let tabObjTextures = [];

  for (let i = 0; i < tabImages.length; i++) {
    // Créer La texture
    let objTexture = objgl.createTexture();

    let ext = objgl.getExtension("EXT_texture_filter_anisotropic");

    // La sélectionner
    objgl.bindTexture(objgl.TEXTURE_2D, objTexture);

    // Insérer l'image à l'intérieur de la texture
    objgl.texImage2D(objgl.TEXTURE_2D, 0, objgl.RGBA, objgl.RGBA,
      objgl.UNSIGNED_BYTE, tabImages[i]);

    // La paramétrer
    objgl.texParameteri(objgl.TEXTURE_2D, objgl.TEXTURE_MAG_FILTER, objgl.LINEAR);
    objgl.texParameteri(objgl.TEXTURE_2D, objgl.TEXTURE_MIN_FILTER, objgl.LINEAR_MIPMAP_LINEAR);
    objgl.texParameterf(objgl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, 4);
    objgl.generateMipmap(objgl.TEXTURE_2D);

    objgl.texParameteri(objgl.TEXTURE_2D, objgl.TEXTURE_WRAP_S, objgl.REPEAT);
    objgl.texParameteri(objgl.TEXTURE_2D, objgl.TEXTURE_WRAP_T, objgl.REPEAT);

    // Insérer cette texture dans un tableau de textures
    tabObjTextures.push(objTexture);
  }

  return tabObjTextures;
}
