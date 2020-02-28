module.exports = function parseStringAsArray(arrayAsString) {
  return arrayAsString.split(',').map(type => type.trim());
}
