class TexelColl extends Array{
  /**
   * @param {number[][]} texel
   * @param {number} noTex
   */
  constructor(texel, noTex, pcCouleur) {
    super();
    this.splice(0,0, texel);
    this.noTex = noTex;
    this.pcCouleur = pcCouleur;
  }
}