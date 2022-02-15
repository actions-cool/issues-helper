const { readFileSync, writeFileSync } = require('fs');
const { stripIndent } = require('common-tags');

// **************************************************************************

let { users } = require('../USERS.js');

users.sort((a, b) => getCurrentName(a).localeCompare(getCurrentName(b)));

// **************************************************************************
const DEFAULT_WIDTH = 46;

// **************************************************************************
let table = '';
let row = users.length / 4;
let lastNo = users.length % 4;
if (lastNo != 0) row += 1;
for (let j = 1; j <= row; j++) {
  let data = '';
  data = stripIndent`
<tr>
  <td align="center" width="180">${getImg(users[(j - 1) * 4])}</td>
  <td align="center" width="180">${getImg(users[(j - 1) * 4 + 1])}</td>
  <td align="center" width="180">${getImg(users[(j - 1) * 4 + 2])}</td>
  <td align="center" width="180">${getImg(users[(j - 1) * 4 + 3])}</td>
</tr>
<tr>
  <td align="center" width="180">${getName(users[(j - 1) * 4])}</td>
  <td align="center" width="180">${getName(users[(j - 1) * 4 + 1])}</td>
  <td align="center" width="180">${getName(users[(j - 1) * 4 + 2])}</td>
  <td align="center" width="180">${getName(users[(j - 1) * 4 + 3])}</td>
</tr>
`;
  table += data;
}

table = `<table>
${table}
</table>

`;

// **************************************************************************

const point = '<table>';
const cnPoint = `## 图标`;
const enPoint = `## Badge`;

// **************************************************************************

const cn = readFileSync('./README.md', 'utf8');
const cnIn = cn.indexOf(point);
const cnAfterIn = cn.indexOf(cnPoint);
const cnBefore = cn.substring(0, cnIn);
const cnAfter = cn.substring(cnAfterIn, cn.length);
const newcn = cnBefore + table + cnAfter;
writeFileSync('./README.md', newcn);
console.log(`🎉 Done cn`);

// **************************************************************************

const en = readFileSync('./README.en-US.md', 'utf8');
const enIn = en.indexOf(point);
const enAfterIn = en.indexOf(enPoint);
const enBefore = en.substring(0, enIn);
const enAfter = en.substring(enAfterIn, en.length);
const newen = enBefore + table + enAfter;
writeFileSync('./README.en-US.md', newen);
console.log(`🎉 Done en`);

// **************************************************************************

function getImg(o) {
  if (o) {
    return `
    <a href="${o.url}">
      <img src="${o.logo}"${getImgWidth(o)}/>
    </a>
  `;
  }
  return ``;
}

function getImgWidth(o) {
  if (o) {
    let width = o.width;
    if (width === 'auto') {
      width = '';
    } else {
      width = width ? width : DEFAULT_WIDTH;
    }
    return ` width="${width}"`;
  }
  return '';
}

function getName(o) {
  if (o) {
    return `<a href="${o.url}">${o.url.split('/').slice(-1)[0]}</a>`;
  }
  return ``;
}

function getCurrentName(o) {
  if (o) {
    return o.url.split('/').slice(-1)[0];
  }
  return ``;
}

// **************************************************************************
