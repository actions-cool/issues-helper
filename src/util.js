function dealInput (para) {
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

function matchKeyword (content, keywords) {
  return keywords.find(item => content.toLowerCase().includes(item));
};

function testDuplicate(body) {
  if (!body || !body.startsWith('Duplicate of')) {
    return false
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
  dealInput,
  getPreMonth,
  matchKeyword,
  testDuplicate,
};
