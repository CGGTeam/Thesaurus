class TexelColl {
  /**
   * @param {Float32Array} texel - Tableau de texels. Chaque texel équivaut à deux valeurs number dans le tableau (x, y)
   * @param {int} noTex - Entier qui équivaut à la texture dans Scene.
   * @param {number} pcCouleur - Pourcentage d'opacité de la texture
   */
  constructor(texel, noTex, pcCouleur) {
    this.texel = texel;
    this.noTex = noTex;
    this.pcCouleur = pcCouleur;
  }
}