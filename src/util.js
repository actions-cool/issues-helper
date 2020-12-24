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

module.exports = {
  dealInput,
};
