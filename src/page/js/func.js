import '../css/common.less'

import tell from './lib/tell.js'

// let idx = [1,2,3].includes(1);
let { a, b, c, d } = { a: 1, b: 2, c: 3, d: 4 };

const test = (a, ...argu) => [a, ...argu];

console.log(test(a, b, c, d));

const tl = new tell();
// tl.getter();
// console.log(tell.name);
tl.init();
tl.prop = [1, 2, 3, 4, 5, 6, 7];
tl.init();

async function setname() {
    let a = await getname(3000);
    document.getElementById('percent').innerHTML = a;
}

function getname(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('yehubin');
        }, time);
    })
}

setname();

const ar1 = [1,2,3];
const ar2 = [2,5,3,8];
const arr = new Set([...ar1].filter(x => new Set([...ar2]).has(x)));
console.log(...arr);

