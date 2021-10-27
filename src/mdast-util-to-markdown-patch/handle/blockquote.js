module.exports = blockquote

const flow = require('../util/container-flow')
const indentLines = require('../util/indent-lines')

function blockquote (node, _, context) {
  const exit = context.enter('blockquote')
  const value = indentLines(flow(node, context), map)
  exit()
  return value
}

function map (line, index, blank) {
  return '>' + (blank ? '' : ' ') + line
}
