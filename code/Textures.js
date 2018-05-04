// Textures.js

function creerTextures(objgl, tabImages) {
    var tabObjTextures = new Array();
	  
    for (var i = 0; i < tabImages.length; i++) {
        // L'image de la texture
        var objImage = new Image();
        objImage.src = tabImages[i];

        // Créer La texture
        var objTexture = objgl.createTexture();

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
        tabObjTextures.push(objTexture);
    }

    return tabObjTextures;
}
