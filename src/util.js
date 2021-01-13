const sampleSize  = require('lodash/sampleSize');

function dealStringToArr (para) {
  /**
   * in  'x1,x2,x3'
   * out ['x1','x2','x3']
   */
  let arr = [];
  if (para) {
    const paraArr = para.split(',');
    paraArr.forEach(it => {
      if(it.trim()){
        arr.push(it.trim())
      }
    })
  }
  return arr;
};

function dealRandomAssignees (assignees, randomTo) {
  let arr = dealStringToArr(assignees);
  if (randomTo && Number(randomTo) > 0 && Number(randomTo) < arr.length) {
    arr = sampleSize(arr, randomTo);
  }
  return arr;
};

function matchKeyword (content, keywords) {
  return keywords.find(item => content.toLowerCase().includes(item));
};

function testDuplicate(body) {
  if (!body || !body.startsWith('Duplicate of') || body.includes('?')) {
    return false;
  }

  let arr = body.split(' ');
  if (arr[0] == 'Duplicate' && arr[1] == 'of') {
    return true;
  } else {
    return false;
  }
};

function getPreMonth (m) {
  return m == 1 ? 12 : m -1;
};

module.exports = {
  dealStringToArr,
  dealRandomAssignees,
  getPreMonth,
  matchKeyword,
  testDuplicate,
};
