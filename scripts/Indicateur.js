class Indicateur extends Objet3D{
  constructor (transform) {
    let vertex = new Float32Array([
      0.0, 3.0, -0.5, //A
      0.5, 3.0, 0.5, //B
      0.0, 3.0, 0.3, //C
      -0.5, 3.0, 0.5, //D
    ]);
    let maillage = new Maillage(new Uint16Array([
      2, 1, 0,
      0, 3, 2
    ]), 0, 2);
    let texels = new TexelColl(new Float32Array([
      0,0,
      0,0,
      0,0,
      0,0
    ]), 0, 0);
    let couleurs = new Float32Array([
      0.0, 1.0, 0.0, 1.0,
      0.0, 1.0, 0.0, 1.0,
      0.0, 1.0, 0.0, 1.0,
      0.0, 1.0, 0.0, 1.0
    ]);
    super(vertex, maillage, texels, transform, couleurs);
  }
}