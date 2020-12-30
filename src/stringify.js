'use strict'

module.exports = stringify

const toMarkdown = require('./mdast-util-to-markdown');

function stringify(options) {
    const self = this;

    this.Compiler = compile

    function compile(tree) {
        return toMarkdown(
            tree,
            Object.assign({}, self.data('settings'), options, {
                extensions: self.data('toMarkdownExtensions') || []
            })
        )
    }
}
