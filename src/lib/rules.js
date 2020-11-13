'use strict';

const mdu = require('markdown-utils');
const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
const escapeRe = str => str.replace(/[-.?*+^$[\]\\(){}|]/g, '\\$&');

/**
 * Renderer rules cache
 */

const rules = {
  list: {ordered: false, num: 1},
  inside: {},
  badges: [],
  links: [],
  images: [],
  count: {
    badges: 0,
    images: 0,
    links: 0
  }
};

/**
 * Blockquotes
 */

rules.blockquote_open = () => '> ';
rules.blockquote_close = () => '';

/**
 * Code
 */

rules.code = function(tokens, idx) {
  if (tokens[idx].block) {
    return '```' + tokens[idx].content + '```' + getBreak(tokens, idx);
  }
  return `\`${tokens[idx].content}\``;
};

/**
 * Fenced code blocks
 */

rules.fence = function(tokens, idx, options, env, self) {
  const token = tokens[idx];
  let language;

  if (token.params) {
    let i = token.params.indexOf(' ');
    if (i === -1) i = token.params.length;
    language = token.params.slice(0, i);

    if (hasOwn(self.rules.fence_custom, language)) {
      return self.rules.fence_custom[language](tokens, idx, options, env, self);
    }
  }

  token.content = token.content.replace(/^\n+/, '');
  token.content = token.content.replace(/\n+$/, '');

  let res = '\n';
  res += '```' + (language || '') + '\n';
  res += token.content + '\n';
  res += '```\n';
  res += getBreak(tokens, idx);
  return res;
};
rules.fence_custom = {};

/**
 * Headings
 */

rules.heading_open = (tokens, idx) => '#'.repeat(tokens[idx].hLevel) + ' ';
rules.heading_close = (tokens, idx) => '\n' + getBreak(tokens, idx);

/**
 * Horizontal rules
 */

rules.hr = (tokens, idx) => '***\n' + getBreak(tokens, idx);

/**
 * Bullets
 */

rules.bullet_list_open = function(tokens, idx/*, options, env */) {
  rules.list.ordered = false;
  return '\n';
};
rules.bullet_list_close = (tokens, idx) => getBreak(tokens, idx);

/**
 * Ordered list items
 */

rules.ordered_list_open = function(tokens, idx/*, options, env */) {
  rules.list.ordered = true;
  return '\n';
};
rules.ordered_list_close = function(tokens, idx) {
  rules.list.ordered = false;
  rules.list.num = 1;
  return getBreak(tokens, idx);
};

/**
 * List items
 */

rules.list_item_open = function(tokens, idx, options = {}/*, env */) {
  let token = tokens[idx];
  let next = tokens[idx + 2] || {};
  let level = lvl(token.level);

  if (next.children && next.children.length > 1) {
    for (let i = 1; i < next.children.length; i++) {
      let child = next.children[i];
      if (child.content && /^[-\w]{1,2}[.]\s/.test(child.content)) {
        let prefix = ' '.repeat(level + 2);
        next.children[i].content = (prefix + child.content);
        next.children[i].level = level + 2;
      }
    }
  }

  // list info
  options.chars = ['*', '-', '+'];
  if (rules.list.ordered) {
    options.chars = [(rules.list.num++) + '.'];
  }

  return mdu.li('', level, options, (indent, ch, lvl) => {
    return indent + ch + ' ';
  });
};

rules.list_item_close = function(tokens, idx/*,options, env */) {
  let prev = tokens[idx - 1];
  let br = getBreak(tokens, idx);
  if (prev && prev.tight) {
    return br;
  }
  return '';
};

/**
 * Paragraphs
 */

rules.paragraph_open = function(tokens, idx) {
  let token = tokens[idx];
  let prev = tokens[idx - 1];
  let next = tokens[idx + 1];
  if (prev && prev.type === 'blockquote_open') {
    return '';
  }
  if (next && next.type === 'inline') {
    return '';
  }
  return token.tight ? '' : '\n';
};
rules.paragraph_close = function(tokens, idx) {
  let token = tokens[idx];
  let next = tokens[idx + 1];
  let prev = tokens[idx - 1];

  if (next && next.type && next.type.indexOf('paragraph') === -1) {
    return token.tight ? '' : '\n' + getBreak(tokens, idx);
  }

  let addBreak = !(token.tight && idx && prev.type === 'inline' && !prev.content);
  return (token.tight ? '' : '\n') + (addBreak ? getBreak(tokens, idx) : '');
};

/**
 * Links
 */

rules.link_open = function(tokens, idx) {
  let prev = tokens[idx - 1];
  let token = tokens[idx];
  let next = tokens[idx + 1] || {};
  let close = tokens[idx + 2] || {};
  let after = tokens[idx + 3] || {};

  if (token && token.href === '' && next && next.content) {
    token.href = '#' + next.content;
  }

  // [foo](bar){#baz} => [foo](bar#baz) to allow `bar` to expand to a full URL
  if (close.type === 'link_close' && after && after.type === 'text') {
    let str = after.content;
    let hasBrace = str.charAt(0) === '{';
    if (str && hasBrace) {
      let end = str.indexOf('}');
      let href = str.slice(1, end);
      if (prev && prev.content && /\w$/.test(prev.content)) {
        prev.content += ' ';
      }
      after.content = str.slice(end + 1);
      if (after.content && /^\w/.test(after.content)) {
        after.content = ' ' + after.content;
      }
      token.href += href;
    }
  }

  let anchor = /\{([^}]+)\}/.exec(token.href);
  if (anchor && anchor[1]) {
    token.href = token.href.replace(anchor[0], anchor[1]);
  } else {

    anchor = /\{([^}]+)\}/.exec(after.content);
    if (anchor && anchor[1]) {
      token.href += anchor[1];
      after.content = after.content.replace(anchor[0], '');
    }
  }

  if (next.type !== 'image') {
    return mdu.link(next.content, token.href, token.title);
  }
  return '';
};
rules.link_close = () => '';

/**
 * Images
 */

rules.image = function(tokens, idx, options, env) {
  let token = tokens[idx];
  let prev = tokens[idx - 1] || {};
  let next = tokens[idx + 1] || {};
  let after = tokens[idx + 2] || {};

  if (next.type === 'text' && next.content) {
    addAnchors(next, options.context || {});
  }

  normalizeAnchors(prev, token, next, after, options.context || {});
  if (prev.type !== 'link_open') {
    return mdu.image(token.alt, token.src, token.title);
  }
  return mdu.badge(token.alt, token.src, prev.href || token.src, token.title);
};

/**
 * Tables
 */

rules.table_open = function(/*tokens, idx, options, env */) {
  rules.align = [];
  rules.inside.table = true;
  return '';
};
rules.table_close = function(/*tokens, idx, options, env */) {
  rules.inside.table = false;
  return '\n';
};

rules.thead_open = function(tokens, idx/*, options, env */) {
  rules.inside.thead = true;
  return '| ';
};
rules.thead_close = function(tokens, idx/*, options, env */) {
  rules.inside.thead = false;
  return '';
};

rules.th_open = function(tokens, idx) {
  switch (tokens[idx].align) {
    case 'center':
      rules.align.push(':---:');
      break;
    case 'left':
      rules.align.push(':---');
      break;
    case 'right':
      rules.align.push('---:');
      break;
    default:
      rules.align.push('---');
      break;
  }
  rules.inside.th = true;
  return '';
};
rules.th_close = function(/*tokens, idx, options, env */) {
  rules.inside.th = false;
  return ' | ';
};

rules.tbody_open = function(tokens, idx/*, options, env */) {
  rules.inside.tbody = true;
  return '| ' + rules.align.join(' | ') + ' |' + '\n';
};
rules.tbody_close = function(/*tokens, idx, options, env */) {
  return '';
};

rules.tr_open = function(tokens, idx/*, options, env */) {
  rules.inside.tr = true;
  return '';
};
rules.tr_close = function(/*tokens, idx, options, env */) {
  rules.inside.tr = false;
  return '\n';
};

rules.td_open = function(tokens, idx/*, options, env */) {
  let prev = tokens[idx - 1];
  if (prev && prev.type === 'tr_open') {
    return '| ';
  } else {
    return ' | ';
  }
};
rules.td_close = function(tokens, idx/* , options, env */) {
  let next = tokens[idx + 1];
  if (next && next.type === 'tr_close') {
    return ' |';
  }
  return '';
};

/**
 * Bold
 */

rules.strong_open = function(tokens, idx/* , options, env */) {
  rules.inside.strong = {};
  let prev = tokens[idx - 1];
  let res = '';

  if (prev && prev.type === 'softbreak') {
    res += '\n';
  }

  rules.inside.strong.prev = prev;
  res += '**';
  return res;
};
rules.strong_close = function(tokens, idx/* , options, env */) {
  let prev = rules.inside.strong.prev;
  // if it's not a "heading", or it's inside a table heading
  if (prev && prev.type === 'text' || rules.inside.th) {
    return '**';
  }
  let res = detectBreak(tokens, idx, '**');
  rules.inside.strong = null;
  return res;
};

/**
 * Italicize
 */

rules.em_open = () => '_';
rules.em_close = (tokens, idx) => detectBreak(tokens, idx, '_');

/**
 * Strikethrough
 */

rules.del_open = () => '~~';
rules.del_close = (tokens, idx) => detectBreak(tokens, idx, '~~');

/**
 * Insert
 */

rules.ins_open = () => '<ins>';
rules.ins_close = () => '</ins>';

/**
 * Highlight
 */

rules.mark_open = () => '<mark>';
rules.mark_close = () => '</mark>';

/**
 * Super- and sub-script
 */

rules.sub = (tokens, idx) => `<sub>${tokens[idx].content}</sub>`;
rules.sup = (tokens, idx) => `<sup>${tokens[idx].content}</sup>`;

/**
 * Breaks
 */

rules.hardbreak = () => '\n\n';
rules.softbreak = () => '\n';

/**
 * Text
 */

rules.text = function(tokens, idx, options, env) {
  let ctx = options.context || {};
  let token = tokens[idx];
  addAnchors(token, ctx);

  let prev = tokens[idx - 1];
  if (prev && prev.type === 'link_open') {
    return '';
  }
  return token.content;
};

/**
 * Content
 */

rules.htmlblock = (tokens, idx) => tokens[idx].content;
rules.htmltag = (tokens, idx) => tokens[idx].content;

/**
 * Abbreviations, initialism
 */

rules.abbr_open = function(tokens, idx) {
  return '<abbr title="' + tokens[idx].title + '">';
};
rules.abbr_close = function(/*tokens, idx, options, env */) {
  return '</abbr>';
};

/**
 * Footnotes
 */

rules.footnote_ref = function(tokens, idx) {
  let n = Number(tokens[idx].id + 1).toString();
  let id = 'fnref' + n;
  if (tokens[idx].subId > 0) {
    id += ':' + tokens[idx].subId;
  }
  return '<sup class="footnote-ref"><a href="#fn' + n + '" id="' + id + '">[' + n + ']</a></sup>';
};
rules.footnote_block_open = function(tokens, idx, options) {
  let hr = options.xhtmlOut
    ? '<hr class="footnotes-sep" />\n'
    : '<hr class="footnotes-sep">\n';
  return hr + '<section class="footnotes">\n<ol class="footnotes-list">\n';
};
rules.footnote_block_close = () => '</ol>\n</section>\n';
rules.footnote_open = function(tokens, idx) {
  let id = Number(tokens[idx].id + 1).toString();
  return '<li id="fn' + id + '"  class="footnote-item">';
};
rules.footnote_close = () => '</li>\n';
rules.footnote_anchor = function(tokens, idx) {
  let n = Number(tokens[idx].id + 1).toString();
  let id = 'fnref' + n;
  if (tokens[idx].subId > 0) {
    id += ':' + tokens[idx].subId;
  }
  return ' <a href="#' + id + '" class="footnote-backref">↩</a>';
};

/**
 * Definition lists
 */

rules.dl_open = () => '<dl>\n';
rules.dt_open = () => '<dt>';
rules.dd_open = () => '<dd>';
rules.dl_close = () => '</dl>\n';
rules.dt_close = () => '</dt>\n';
rules.dd_close = () => '</dd>\n';

/**
 * Helper functions
 */

function nextToken(tokens, idx) {
  if (++idx >= tokens.length - 2) {
    return idx;
  }
  if ((tokens[idx].type === 'paragraph_open' && tokens[idx].tight) &&
      (tokens[idx + 1].type === 'inline' && tokens[idx + 1].content.length === 0) &&
      (tokens[idx + 2].type === 'paragraph_close' && tokens[idx + 2].tight)) {
    return nextToken(tokens, idx + 2);
  }
  return idx;
}

/**
 * Check to see if `\n` is needed before the next token.
 *
 * @param  {Array} `tokens`
 * @param  {Number} `idx`
 * @return {String} Empty string or newline
 * @api private
 */

const getBreak = rules.getBreak = (tokens, idx) => {
  idx = nextToken(tokens, idx);
  if (idx < tokens.length && tokens[idx].type === 'list_item_close') {
    return '';
  }
  return '\n';
};

function addAnchors(token, ctx) {
  const re = /(!?\[([^\]]+)\])(\[([^\]]+)\]|(?:\[\]))?(\{(#[^}]+)\})*/g;
  let match;
  let str = token.content;

  while ((match = re.exec(str))) {
    let reflink = match[1];
    let text = match[2] || '';
    let colInner = match[4] || '';
    let anchor = match[5] || '';
    let inner = match[6] || '';

    let before = str;
    if (ctx.reflinks && ctx.reflinks.hasOwnProperty(text)) {
      let resolved = reflink + '(' + ctx.reflinks[text].trim() + inner + ')';

      let reStr = '(^|[^\\[]+?)\\!?' + escapeRe(reflink)
        + '(?:(?:\\[' + text + '\\])|\\[\\]|(?:\\[' + colInner + '\\]))*'
        + (anchor ? escapeRe(anchor) : '') + '([\\s\\S]+?|$)';

      token.content = str.replace(new RegExp(reStr), function(m, $1, $2) {
        return $1 + resolved + $2;
      });
    }

    if (str === before) {
      break;
    }
  }
}

function normalizeAnchors(prev, token, next, after, ctx) {
  if (!token.src) return;
  const re = /(?:([^{]+))?(\{([#/][^}]+)\})/;
  let before;
  let match;

  let nextTok = next.content ? next : after;

  while ((match = re.exec(nextTok.content))) {
    before = nextTok.content;
    nextTok.content = nextTok.content.split(match[0]).join('');
    if (before === nextTok.content) break;

    if (prev.href) {
      prev.href += match[3];
    } else if (token.src) {
      token.src += match[3];
    }
  }

  while ((match = re.exec(token.src))) {
    before = token.src;
    token.src = match[1] + match[3] || '';
    if (before === token.src) {
      break;
    }
  }
}

function detectBreak(tokens, idx, ch) {
  let next = tokens[idx + 1];
  let res = ch;
  if (!next || next.type === 'softbreak') {
    res += '\n';
  }
  return res;
}

function lvl(level) {
  if (typeof level === 'undefined') return null;
  level = level - 1;
  return level > 0 ? (level / 2) : 0;
}

/**
 * Expose `rules`
 */

module.exports = rules;
