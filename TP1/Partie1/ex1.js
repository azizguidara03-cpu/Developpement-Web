var a = 9;
let b = 10;
const c = 11;

{
    var a = 20;
    let b = 21;
    const c = 22;
    console.log("bloc:",a,b,c);

}

console.log("Outside bloc:",a,b,c);

c=13;