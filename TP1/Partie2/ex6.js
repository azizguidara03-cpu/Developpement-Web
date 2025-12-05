class Etudiant{
    constructor(nom,note){
        this.nom = nom;
        this.note = note;
    }
    getMention(){
        if (this.note >= 16) return "Très bien";
        if (this.note >= 14) return "Bien";
        if (this.note >= 10) return "Passable";
        return "Échec";
    }
}

const E1 = new Etudiant("lamine",10);
const E2 = new Etudiant("pedri",8);
const E3 = new Etudiant("olmo",20);

console.log(E1.getMention());
console.log(E2.getMention());
console.log(E3.getMention());

