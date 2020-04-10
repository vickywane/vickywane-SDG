// enabling es6 using lightweight esm  module
const main = require('esm')(module);

module.exports = main('./src/server.js');
