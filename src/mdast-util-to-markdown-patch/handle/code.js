module.exports = code

const repeat = require('repeat-string')
const streak = require('longest-streak')
const formatCodeAsIndented = require('../util/format-code-as-indented')
const checkFence = require('../util/check-fence')
const safe = require('../util/safe')

function code(node, _, context) {
  const marker = checkFence(context)
  const raw = node.value || ''
  const suffix = marker === '`' ? 'GraveAccent' : 'Tilde'
  let value
  let sequence
  let exit
  let subexit

  if (formatCodeAsIndented(node, context)) {
    exit = context.enter('codeIndented')
    // value = indentLines(raw, map)
    value = raw
  } else {
    sequence = repeat(marker, Math.max(streak(raw, marker) + 1, 3))
    exit = context.enter('codeFenced')
    value = sequence

    if (node.lang) {
      subexit = context.enter('codeFencedLang' + suffix)
      value += safe(context, node.lang, {
        before: '`',
        after: ' ',
        encode: ['`']
      })
      subexit()
    }

    if (node.lang && node.meta) {
      subexit = context.enter('codeFencedMeta' + suffix)
      value +=
        ' ' +
        safe(context, node.meta, {
          before: ' ',
          after: '\n',
          encode: ['`']
        })
      subexit()
    }

    value += '\n'

    if (raw) {
      value += raw + '\n'
    }

    value += sequence
  }

  exit()
  return value
}