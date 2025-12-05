// === Étape 2 : premières variables ===
let tasks = [];

// Message test
console.log("Bienvenue dans la To-Do List !");

// === Étape 3 & 4 : ajouter une tâche ===
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const counter = document.getElementById("counter");
const clearAllBtn = document.getElementById("clearAll");

// Charger les données sauvegardées
if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  renderTasks();
}

// Ajouter via clic
addBtn.addEventListener("click", ajouterTache);

// Ajouter via touche "Entrée"
taskInput.addEventListener("keypress", function(e) {
  if (e.key === "Enter") ajouterTache();
});

// === Étape 6 : Fonctions ===
function ajouterTache() {
  const text = taskInput.value.trim();
  if (text === "") return;

  const newTask = {
    texte: text,
    terminee: false
  };
  tasks.push(newTask);
  taskInput.value = "";
  sauvegarder();
  renderTasks();
}

function supprimerTache(index) {
  tasks.splice(index, 1);
  sauvegarder();
  renderTasks();
}

function terminerTache(index) {
  tasks[index].terminee = !tasks[index].terminee;
  sauvegarder();
  renderTasks();
}

// === Étape 7 & 8 : Affichage avec boucle et objets ===
function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((tache, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="${tache.terminee ? 'done' : ''}">${tache.texte}</span>
      <div>
        <button class="btn btn-terminer">✓</button>
        <button class="btn btn-supprimer">✗</button>
      </div>
    `;
    li.querySelector(".btn-terminer").addEventListener("click", () => terminerTache(index));
    li.querySelector(".btn-supprimer").addEventListener("click", () => supprimerTache(index));
    taskList.appendChild(li);
  });

  // Compteur
  const nbTotal = tasks.length;
  const nbTerminees = tasks.filter(t => t.terminee).length;
  counter.textContent = `Tâches : ${nbTerminees} terminées / ${nbTotal} au total`;
}

// === Étape 9 : LocalStorage ===
function sauvegarder() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// === Étape 10 : Tout supprimer ===
clearAllBtn.addEventListener("click", () => {
  if (confirm("Supprimer toutes les tâches ?")) {
    tasks = [];
    sauvegarder();
    renderTasks();
  }
});
