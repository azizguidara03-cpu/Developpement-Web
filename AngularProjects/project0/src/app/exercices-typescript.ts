// exercices-typescript.ts

// 1) Variables primitives
const nom: string = "Moussa";
let age: number = 21;
let estEtudiant: boolean = true;
const note: number | null = null; // union avec null

// 2) Fonction typée qui calcule la somme
function somme(a: number, b: number): number {
  return a + b;
}

// Exemple d'utilisation
console.log("2 + 3 =", somme(2, 3));

// 3) Interface Etudiant
interface Etudiant {
  id: number;
  nom: string;
  prenom: string;
  age?: number; // optionnel
}

// 4) Classe Etudiant qui implémente l'interface
class EtudiantImpl implements Etudiant {
  constructor(
    public id: number,
    public nom: string,
    public prenom: string,
    public age?: number
  ) {}

  afficherInfos(): void {
    console.log(`Etudiant #${this.id}: ${this.prenom} ${this.nom} (${this.age ?? "âge non précisé"})`);
  }
}

// Exemple
const etu = new EtudiantImpl(1, "Guidara", "Aziz", 20);
etu.afficherInfos();

// Partie 5: concepts avancés

// 1) Fonction générique qui retourne un tableau du même type
function creerTableau<T>(...elements: T[]): T[] {
  return [...elements];
}

const nombres = creerTableau<number>(1, 2, 3);
const chaines = creerTableau<string>("a", "b");

// 2) Unions et types optionnels
type ID = number | string;
function afficherId(id: ID) {
  if (typeof id === "number") {
    console.log("ID numérique:", id);
  } else {
    console.log("ID chaîne:", id);
  }
}
afficherId(42);
afficherId("abc-123");

// 3) Enum
enum Role {
  Etudiant,
  Enseignant,
  Admin
}

const userRole: Role = Role.Etudiant;
console.log("Role:", Role[userRole]);

// 4) Exemple d'utilisation de generics avec interface
interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

const resp: ApiResponse<Etudiant> = {
  data: { id: 2, nom: "Doe", prenom: "Jane", age: 22 },
  success: true
};
console.log("ApiResponse:", resp);
