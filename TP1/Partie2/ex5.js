const livre ={
    titre:"The Child",
    auteur:"Fiona Barton",
    annee:2015,
    getinfo(){
        return `${this.titre} de ${this.auteur} (${this.annee})`;
    }
};

console.log(livre.getinfo());