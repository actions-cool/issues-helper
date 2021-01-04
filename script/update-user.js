const { readFileSync, writeFileSync } = require('fs');
const { stripIndent } = require('common-tags');

// **************************************************************************

let users = [
  {
    url: 'https://github.com/ant-design/ant-design',
    logo: 'https://avatars1.githubusercontent.com/u/12101536?s=200&v=4'
  },
  {
    url: 'https://github.com/vueComponent/ant-design-vue',
    logo: 'https://avatars1.githubusercontent.com/u/32120805?s=200&v=4'
  },
  {
    url: 'https://github.com/umijs/dumi',
    logo: 'https://avatars1.githubusercontent.com/u/33895495?s=200&v=4'
  },
  {
    url: 'https://github.com/umijs/umi',
    logo: 'https://avatars1.githubusercontent.com/u/33895495?s=200&v=4'
  },
  {
    url: 'https://github.com/AttoJS/vue-request',
    logo: 'https://raw.githubusercontent.com/AttoJS/art/master/vue-request-logo.png'
  },
  {
    url: 'https://github.com/mui-org/material-ui',
    logo: 'https://avatars2.githubusercontent.com/u/33663932?s=200&v=4'
  },
];

users.sort((a, b) => getName(a).localeCompare(getName(b)));

// **************************************************************************

let table = '';
let row = users.length / 5;
let lastNo = users.length % 5;
if (lastNo != 0) row += 1;
for (let j = 1; j <= row; j++) {
  let data = '';
  data = stripIndent`
<tr>
  <td align="center" width="160">
    ${getImg(users[(j-1)*5])}
  </td>
  <td align="center" width="160">
    ${getImg(users[(j-1)*5+1])}
  </td>
  <td align="center" width="160">
    ${getImg(users[(j-1)*5+2])}
  </td>
  <td align="center" width="160">
    ${getImg(users[(j-1)*5+3])}
  </td>
  <td align="center" width="160">
    ${getImg(users[(j-1)*5+4])}
  </td>
</tr>`;
  table += data
};

table = `<table>
${table}
</table>
`;

// **************************************************************************

const point = '<table>';
const last = `
## LICENSE

[MIT](https://github.com/actions-cool/issues-helper/blob/main/LICENSE)
`;

// **************************************************************************

const cn = readFileSync('./README.md', 'utf8');
const cnIn = cn.indexOf(point);
const cnBefore = cn.substring(0, cnIn);
const newcn = cnBefore + table + last;
writeFileSync('./README.md', newcn);
console.log(`🎉 Done cn`);

// **************************************************************************

const en = readFileSync('./README.en-US.md', 'utf8');
const enIn = en.indexOf(point);
const enBefore = en.substring(0, enIn);
const newen = enBefore + table + last;
writeFileSync('./README.en-US.md', newen);
console.log(`🎉 Done en`);

// **************************************************************************

function getImg (o) {
  if (o) {
    return `<a href="${o.url}">
      <img src="${o.logo}" width="46" />
      <br />
      ${getName(o)}
    </a>`
  }
  return ``
};

function getName (o) {
  if (o) {
    return o.url.split('/').slice(-1)[0]
  }
  return ``
};

// **************************************************************************
