const expect = require('chai').expect;

module.exports = (a, b, ignore) => {
  a.schema.eachPath((key) => {
    if (!ignore.find(e => e === key)) {
      if (key === '_id') { expect(`${a[key]}`, `key '${key}'`).to.equal(`${b[key]}`); }
      else if (key !== '__v') { expect(a[key], `key '${key}'`).to.equal(b[key]); }
    }
  });
};


