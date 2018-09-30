function stringify(obj) {
  const buffer = [];
  for (let key in obj) {
    buffer.push(`${key}=${obj[key]}`);
  }
  return buffer.join('&');
}

module.exports = { stringify };
