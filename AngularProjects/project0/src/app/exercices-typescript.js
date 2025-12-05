// exercices-typescript.ts
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// 1) Variables primitives
var nom = "Moussa";
var age = 21;
var estEtudiant = true;
var note = null; // union avec null
// 2) Fonction typée qui calcule la somme
function somme(a, b) {
    return a + b;
}
// Exemple d'utilisation
console.log("2 + 3 =", somme(2, 3));
// 4) Classe Etudiant qui implémente l'interface
var EtudiantImpl = /** @class */ (function () {
    function EtudiantImpl(id, nom, prenom, age) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.age = age;
    }
    EtudiantImpl.prototype.afficherInfos = function () {
        var _a;
        console.log("Etudiant #".concat(this.id, ": ").concat(this.prenom, " ").concat(this.nom, " (").concat((_a = this.age) !== null && _a !== void 0 ? _a : "âge non précisé", ")"));
    };
    return EtudiantImpl;
}());
// Exemple
var etu = new EtudiantImpl(1, "Guidara", "Aziz", 20);
etu.afficherInfos();
// Partie 5: concepts avancés
// 1) Fonction générique qui retourne un tableau du même type
function creerTableau() {
    var elements = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        elements[_i] = arguments[_i];
    }
    return __spreadArray([], elements, true);
}
var nombres = creerTableau(1, 2, 3);
var chaines = creerTableau("a", "b");
function afficherId(id) {
    if (typeof id === "number") {
        console.log("ID numérique:", id);
    }
    else {
        console.log("ID chaîne:", id);
    }
}
afficherId(42);
afficherId("abc-123");
// 3) Enum
var Role;
(function (Role) {
    Role[Role["Etudiant"] = 0] = "Etudiant";
    Role[Role["Enseignant"] = 1] = "Enseignant";
    Role[Role["Admin"] = 2] = "Admin";
})(Role || (Role = {}));
var userRole = Role.Etudiant;
console.log("Role:", Role[userRole]);
var resp = {
    data: { id: 2, nom: "Doe", prenom: "Jane", age: 22 },
    success: true
};
console.log("ApiResponse:", resp);
