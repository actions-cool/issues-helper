const { readFileSync, writeFileSync } = require('fs');

const last = /@v2/g;
const now = `@v3`;

let readme = readFileSync('./README.md', 'utf-8');
readme = readme.replace(last, now);
writeFileSync('./README.md', readme);
console.log('readme done!');

let readmeen = readFileSync('./README.en-US.md', 'utf-8');
readmeen = readmeen.replace(last, now);
writeFileSync('./README.en-US.md', readmeen);
console.log('readmeen done!');

let index = readFileSync('./web/docs/index.md', 'utf-8');
index = index.replace(last, now);
writeFileSync('./web/docs/index.md', index);
console.log('index done!');

let indexen = readFileSync('./web/docs/index.en-US.md', 'utf-8');
indexen = indexen.replace(last, now);
writeFileSync('./web/docs/index.en-US.md', indexen);
console.log('indexen done!');

let base = readFileSync('./web/docs/base.md', 'utf-8');
base = base.replace(last, now);
writeFileSync('./web/docs/base.md', base);
console.log('base done!');

let baseen = readFileSync('./web/docs/base.en-US.md', 'utf-8');
baseen = baseen.replace(last, now);
writeFileSync('./web/docs/base.en-US.md', baseen);
console.log('baseen done!');

let adv = readFileSync('./web/docs/advanced.md', 'utf-8');
adv = adv.replace(last, now);
writeFileSync('./web/docs/advanced.md', adv);
console.log('adv done!');

let adven = readFileSync('./web/docs/advanced.en-US.md', 'utf-8');
adven = adven.replace(last, now);
writeFileSync('./web/docs/advanced.en-US.md', adven);
console.log('adven done!');
