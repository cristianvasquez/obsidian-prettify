import safe from 'mdast-util-to-markdown/lib/util/safe'

function toMarkdown (opts = {}) {
  const aliasDivider = opts.aliasDivider || ':'

  const unsafe = [
    {
      character: '[',
      inConstruct: ['phrasing', 'label', 'reference']
    },
    {
      character: ']',
      inConstruct: ['label', 'reference']
    }
  ]

  function handler (node, _, context) {
    const exit = context.enter('wikiLink')

    const nodeValue = safe(context, node.value, { before: '[', after: ']' })
    const nodeAlias = safe(context, node.data.alias, { before: '[', after: ']' })

    let value
    if (nodeAlias !== nodeValue) {
      value = `[[${nodeValue}${aliasDivider}${nodeAlias}]]`
    } else {
      value = `[[${nodeValue}]]`
    }

    exit()

    return value
  }

  return {
    unsafe: unsafe,
    handlers: {
      wikiLink: handler
    }
  }
}

export { toMarkdown }
