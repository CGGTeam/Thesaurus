class Maillage extends Array{
  constructor(maillage, nbDroites, nbTriangles) {
    super();
    this.splice(0,0, maillage);
    this.nbDroites = nbDroites;
    this.nbTriangles = nbTriangles;
  }
}