const { readFileSync, writeFileSync } = require('fs');

const last = /v1\.11/g;
const now = 'v2';

let readme = readFileSync('./README.md', 'utf-8');
readme = readme.replace(last, now);
writeFileSync('./README.md', readme);
console.log('readme done!');

let readmeen = readFileSync('./README.en-US.md', 'utf-8');
readmeen = readmeen.replace(last, now);
writeFileSync('./README.en-US.md', readmeen);
console.log('readmeen done!');

let index = readFileSync('./docs/index.md', 'utf-8');
index = index.replace(last, now);
writeFileSync('./docs/index.md', index);
console.log('index done!');

let indexen = readFileSync('./docs/index.en-US.md', 'utf-8');
indexen = indexen.replace(last, now);
writeFileSync('./docs/index.en-US.md', indexen);
console.log('indexen done!');

let base = readFileSync('./docs/base.md', 'utf-8');
base = base.replace(last, now);
writeFileSync('./docs/base.md', base);
console.log('base done!');

let baseen = readFileSync('./docs/base.en-US.md', 'utf-8');
baseen = baseen.replace(last, now);
writeFileSync('./docs/base.en-US.md', baseen);
console.log('baseen done!');

let adv = readFileSync('./docs/advanced.md', 'utf-8');
adv = adv.replace(last, now);
writeFileSync('./docs/advanced.md', adv);
console.log('adv done!');

let adven = readFileSync('./docs/advanced.en-US.md', 'utf-8');
adven = adven.replace(last, now);
writeFileSync('./docs/advanced.en-US.md', adven);
console.log('adven done!');
