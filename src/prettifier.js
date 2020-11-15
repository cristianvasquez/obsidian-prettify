const gfm = require('remark-gfm')
const unified = require('unified')
const parse = require('remark-parse')
const stringify = require('./stringify')


const settings = {
    bullet: '*',
}
const remark = unified().use(parse).use(stringify, settings).freeze()

function prettifier(
    content,
    settings = {}
) {

    return remark()
        .use(gfm)
        .process(content)
}

module.exports = prettifier
