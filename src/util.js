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

function matchKeyword(content, keywords) {
  return keywords.find(item => content.toLowerCase().includes(item));
};

module.exports = {
  dealInput,
  matchKeyword,
};
