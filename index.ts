require('./src/app')
import packagejson = require('./package.json');
const entrypoint = packagejson.main;
console.log('Starting ' + entrypoint.slice(7));
