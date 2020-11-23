const gfm = require('remark-gfm')
const unified = require('unified')
const parse = require('remark-parse')
const images = require('remark-images')
const frontmatter = require('remark-frontmatter');
const table_writer = require('./table-writer');
const stringify = require('./stringify')
const remark = unified().use(parse).freeze()

function prettifier(
    content,
    {
        bullet = '-',
        emphasis = '_',
        rule = '-',
        updateDatesInHeader = true,
        createHeaderIfNotPresent: createHeaderIfNotPresent = false,
        lastModifiedAt = undefined,
    } = {}
) {

    let result = remark()
        .use(gfm)

    result = result.use(frontmatter)

    if (updateDatesInHeader || createHeaderIfNotPresent) {
        result = result.use(table_writer, {
            createHeaderIfNotPresent: createHeaderIfNotPresent,
            updateDatesInHeader: updateDatesInHeader,
            lastModifiedAt: lastModifiedAt
        })
    }

    result
        .use(images)
        .use(stringify, {
            bullet: bullet,
            emphasis: emphasis,
            rule: rule
        })

    return result.process(content)


}

module.exports = prettifier
