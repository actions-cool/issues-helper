function dealInput (para) {
  let arr = [];
  if (para) {
    if (typeof(para) === 'string') {
      arr.push(para);
    } else {
      arr = para;
    }
  }
  return arr;
};

module.exports = {
  dealInput,
};
