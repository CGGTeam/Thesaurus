/**
 * @classdesc Extension de la classe Array qui inclut les propriétés noTex et pcCouleur. Créer pour être utilisé avec
 * la classe Objet3D (et ses sous-classes)
 */
class TexelColl extends Array{
  /**
   * @param {number[]} texel - Tableau de texels. Chaque texel équivaut à deux valeurs number dans le tableau (x, y)
   * @param {int} noTex - Entier qui équivaut à la texture dans Scene.
   * @param {number} pcCouleur - Pourcentage d'opacité de la texture
   */
  constructor(texel, noTex, pcCouleur) {
    super();
    this.splice(0,0, texel);
    this.noTex = noTex;
    this.pcCouleur = pcCouleur;
  }
}