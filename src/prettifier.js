const gfm = require('remark-gfm')
const unified = require('unified')
const images = require('remark-images')
const frontmatter = require('remark-frontmatter');
const frontmatter_writer = require('./frontmatter-writer');
const stringify = require('./stringify')
const {NEW_HEADER_TEMPLATE} = require('./constants');
const math = require('remark-math')
const katex = require('rehype-katex')
const moment = require('moment')

const remarkParse = require('remark-parse')
const remark = unified()
    .use(remarkParse, {
        commonmark: true
    }).freeze()

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
    } = {},
    frontMatterData = {today: moment(), tags: []}
) {
    let result = remark()
        .use(gfm)
        .use(frontmatter)

    if (createHeaderIfNotPresent || updateHeader) {
        result = result
            .use(frontmatter_writer, {
                createHeaderIfNotPresent: createHeaderIfNotPresent,
                newHeaderTemplate: newHeaderTemplate,
                updateHeader: updateHeader,
                frontMatterData: frontMatterData
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
