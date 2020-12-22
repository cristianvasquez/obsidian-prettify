// Fix: https://github.com/tech4him1/js-yaml/blob/1393e2539556776899d274cce2cc972b5b9ae69f/lib/js-yaml/loader.js#L114-L119

const jsYaml = require('js-yaml');
console.log(jsYaml.safeDump({'key': "🦐"}))
// yields
// key: "\U0001F990"
