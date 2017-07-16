const expect = require('chai').expect;

module.exports = (a, b, compareID) => {
  a.schema.eachPath((key) => {
    if (key === '_id') {
      if (compareID) { expect(`${a[key]}`, `key '${key}'`).to.equal(`${b[key]}`); }
    }
    else if (key !== '__v') {
      expect(a[key], `key '${key}'`).to.equal(b[key]);
    }
  });
};


