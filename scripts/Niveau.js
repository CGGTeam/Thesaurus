const tabCodeGrille = Object.freeze(
  [
    Plancher.prototype.constructor,
    MurOuvrable.prototype.constructor,
    MurImbrisable.prototype.constructor,
    PlancherTresor.prototype.constructor
  ]
);
class Niveau extends Dessinable{
  constructor (nomFichierGrille) {
    super();
    this.grille = [];
    this.chargerGrille(nomFichierGrille);
  }

  chargerGrille(nomFichierGrille) {
    fetch('https://cggteam.github.io/Thesaurus/' + nomFichierGrille)
      .then(response => response.text()
        .then(contenuFichier => this.traiterGrille(contenuFichier))).catch(e => console.log(e));
  }

  traiterGrille(contenu) {
    let tabContenu = contenu.split(/[\n\r]/);
    for (let i = 0; i < tabContenu.length; i++) {
      this.grille.push([]);
      for (let j = 0; j < tabContenu[i].length; j++) {
        let valeur = parseInt(tabContenu[i].charAt(j));
        if (valeur != 0 && valeur != 3) {
          let objCtor = tabCodeGrille[valeur];
          let fctFactory = objCtor.bind(objCtor, j, i);
          this.grille[i][j] = new fctFactory();
        }
      }
    }
    Scene.getInstance().addDessinable(new Plafond(0,0));
    Scene.getInstance().addDessinable(new Plancher(0,0));
    Scene.getInstance().addDessinable(new PlancherTresor(14,14));
    Scene.getInstance().addDessinable(new Chest(14,12));
    demarrer();
  }

  dessiner(matModeleVue) {
    this.grille.forEach(r => r.forEach(c => {
      if (c)
        c.dessiner(matModeleVue)
    }));
  }
}