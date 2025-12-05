const notes = [12, 5, 17, 9, 20];

const moy = notes.reduce((i,s)=>i+s,0)/notes.length;
console.log("Moyenne = ",moy);

notes.sort((a,b)=>a-b);
console.log("Tri Decroissant : ",notes);

const admis = notes.filter(n=>n>=10);
console.log("notes >=10 : ",admis);