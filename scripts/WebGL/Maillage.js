class Maillage{
  /**
   *
   * @param {Uint16Array} maillage - tableau qui contient des triangles (3 X int) et/ou des droites (2 X int)
   * reliant des Vertex. Ces entiers représentent les index des vertex dans un autre tableau prédéfini.
   * @param {int} nbDroites - nombre de Droites dans le tableau maillage
   * @param {int} nbTriangles - nombre de Triangles dans le tableau maillage
   */
  constructor(maillage, nbDroites, nbTriangles) {
    this.maillage = maillage;
    this.nbDroites = nbDroites;
    this.nbTriangles = nbTriangles;
  }
}