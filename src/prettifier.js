const gfm = require('remark-gfm')
const unified = require('unified')
const parse = require('remark-parse')
const images = require('remark-images')
const frontmatter = require('remark-frontmatter');
const metadata = require('remark-metadata');
const stringify = require('./stringify')
const remark = unified().use(parse).freeze()

function prettifier(
    content,
    {bullet = '-', emphasis = '_', rule = '-', addMetadataTable = false} = {},
    {title = undefined} = {}
) {
    if (typeof title != "undefined") {
        console.log('The title is defined!')
    }

    let result = remark().use(gfm)

    if (addMetadataTable) {
        result = result.use(frontmatter)
        result = result.use(metadata, {git: true})
    }

    const stringify_settings = {
        bullet: bullet,
        emphasis: emphasis,
        rule: rule
    }
    result.use(stringify, stringify_settings)
    result = result.use(images)
    return result.process(content)


}

module.exports = prettifier
