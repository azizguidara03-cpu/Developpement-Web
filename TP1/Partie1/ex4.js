const tab1 = [1, 2, 3];
const tab2 = [4, 5, 6];
const fus = [...tab1,...tab2];
console.log(fus);

const user = {name:"lamine",age:17};
const copy = {...user,age:18};
console.log(copy);