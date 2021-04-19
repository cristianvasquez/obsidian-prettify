function fromMarkdown (opts = {}) {
  const permalinks = opts.permalinks || []
  const defaultPageResolver = (name) => [name.replace(/ /g, '_').toLowerCase()]
  const pageResolver = opts.pageResolver || defaultPageResolver
  const newClassName = opts.newClassName || 'new'
  const wikiLinkClassName = opts.wikiLinkClassName || 'internal'
  const defaultHrefTemplate = (permalink) => `#/page/${permalink}`
  const hrefTemplate = opts.hrefTemplate || defaultHrefTemplate

  function enterWikiLink (token) {
    this.enter(
      {
        type: 'wikiLink',
        value: null,
        data: {
          alias: null,
          permalink: null,
          exists: null
        }
      },
      token
    )
  }

  function top (stack) {
    return stack[stack.length - 1]
  }

  function exitWikiLinkAlias (token) {
    const alias = this.sliceSerialize(token)
    const current = top(this.stack)
    current.data.alias = alias
  }

  function exitWikiLinkTarget (token) {
    const target = this.sliceSerialize(token)
    const current = top(this.stack)
    current.value = target
  }

  function exitWikiLink (token) {
    const wikiLink = this.exit(token)

    const pagePermalinks = pageResolver(wikiLink.value)
    let permalink = pagePermalinks.find(p => permalinks.indexOf(p) !== -1)
    const exists = permalink !== undefined
    if (!exists) {
      permalink = pagePermalinks[0]
    }
    let displayName = wikiLink.value
    if (wikiLink.data.alias) {
      displayName = wikiLink.data.alias
    }

    let classNames = wikiLinkClassName
    if (!exists) {
      classNames += ' ' + newClassName
    }

    wikiLink.data.alias = displayName
    wikiLink.data.permalink = permalink
    wikiLink.data.exists = exists

    wikiLink.data.hName = 'a'
    wikiLink.data.hProperties = {
      className: classNames,
      href: hrefTemplate(permalink)
    }
    wikiLink.data.hChildren = [{
      type: 'text',
      value: displayName
    }]
  }

  return {
    enter: {
      wikiLink: enterWikiLink
    },
    exit: {
      wikiLinkTarget: exitWikiLinkTarget,
      wikiLinkAlias: exitWikiLinkAlias,
      wikiLink: exitWikiLink
    }
  }
}

export { fromMarkdown }
