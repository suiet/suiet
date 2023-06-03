const colors = require('./index.json');

// https://www.geeksforgeeks.org/flatten-javascript-objects-into-a-single-depth-object/
const flattenObj = (ob, join = '_') => {
  let result = {};

  for (const i in ob) {
    if (typeof ob[i] === 'object' && !Array.isArray(ob[i])) {
      const temp = flattenObj(ob[i], join);
      for (const j in temp) {
        result[i + join + j] = temp[j];
      }
    } else {
      result[i] = ob[i];
    }
  }
  return result;
};

module.exports = Object.fromEntries(
  Object.entries(flattenObj(colors)).map(([key, value]) => [key.replace(/^[a-z]/g, (m) => m.toUpperCase()), value])
);
module.exports.tailwindMap = Object.fromEntries([
  ...Object.entries(flattenObj(colors, '-')).map(([key, value]) => [`text-${key}`, value]),
  ...Object.entries(flattenObj(colors, '-')).map(([key, value]) => [`bg-${key}`, value]),
]);
