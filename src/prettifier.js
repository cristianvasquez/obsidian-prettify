const gfm = require('remark-gfm')
const unified = require('unified')
const parse = require('remark-parse')
const images = require('remark-images')
const frontmatter = require('remark-frontmatter');
const table_writer = require('./table-writer');
const stringify = require('./stringify')
const remark = unified().use(parse).freeze()
const {NEW_HEADER_TEMPLATE} = require('./constants');
const math = require('remark-math')
const katex = require('rehype-katex')
const moment = require('moment')

function prettifier(
    content,
    {
        bullet = '-',
        emphasis = '_',
        rule = '-',
        listItemIndent = 'one', // one, mixed, tab

        createHeaderIfNotPresent: createHeaderIfNotPresent = false,
        newHeaderTemplate = NEW_HEADER_TEMPLATE,
        updateHeader = true,
        currentMoment = moment(),
    } = {}
) {
    let result = remark()
        .use(gfm)

    result = result.use(frontmatter)

    if (createHeaderIfNotPresent || updateHeader) {
        result = result.use(table_writer, {
            createHeaderIfNotPresent: createHeaderIfNotPresent,
            newHeaderTemplate: newHeaderTemplate,
            updateHeader: updateHeader,
            currentMoment: currentMoment
        })
    }

    result
        .use(math)
        .use(katex)
        .use(images)
        .use(stringify, {
            bullet: bullet,
            emphasis: emphasis,
            rule: rule,
            listItemIndent: listItemIndent
        })

    return result.process(content)
}

module.exports = prettifier
