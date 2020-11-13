/*!
 * pretty-remarkable <https://github.com/jonschlinkert/pretty-remarkable>
 *
 * Copyright (c) 2014-2018, present, Jon Schlinkert.
 * Released under the MIT License.
 */

'use strict';

const rules = require('./lib/rules');

/**
 * Register as a plugin by passing `prettify` to remarkable's
 * `.use()` method.
 *
 * ```js
 * const md = new Remarkable();
 * md.use(prettify);
 * const result = md.render(str);
 * ```
 *
 * @param {Object} `options`
 * @return {String}
 */

function prettify(md) {
    ast(md);
    const render = md.render;

    md.render = function (str, options) {
        if (typeof str !== 'string') {
            throw new TypeError('expected a string');
        }
        str = str.split(/\]\[\]\s*\n\s*\[/).join('][]\n\n[');
        return render.call(md, str, options);
    };

    md.renderer.renderInline = function (tokens, options, env) {
        const _rules = rules;
        let len = tokens.length, i = 0;
        let str = '';

        while (len--) {
            str += _rules[tokens[i].type](tokens, i++, options, env, this);
        }
        return str;
    };

    md.renderer.render = function (tokens, options, env) {
        let _rules = rules;
        let len = tokens.length, i = -1;
        let str = '';

        while (++i < len) {
            let token = tokens[i];
            if (token.type === 'inline') {
                str += this.renderInline(token.children, options, env);
            } else {
                str += _rules[token.type](tokens, i, options, env, this);
            }
        }

        if (options.condense !== false) {
            str = str.split(/(?:\r\n|\n){2,}/).join('\n\n');
        }

        let newline = '\n';
        if (options.newline === false) {
            newline = '';
        }
        if (typeof options.newline === 'string') {
            newline = options.newline;
        }
        str = str.trim() + newline;
        return str;
    };
}

function ast(md) {
    let parse = md.parse;

    md.parse = function (str, options) {
        let tokens = parse.apply(md, arguments);
        let ast = {type: 'root', nodes: []};
        let nodes = [ast];
        let stack = [];

        function last() {
            return stack.length ? stack[stack.length - 1] : nodes[nodes.length - 1];
        }

        visit({nodes: tokens}, function (token) {
            if (token.children) {
                define(token, 'children', token.children);
            }

            let prev = last();
            let match = parseType(token);
            if (match) {
                if (match[2] === 'open') {
                    let node = {type: match[1], nodes: [token]};
                    define(token, 'parent', node);
                    define(node, 'parent', prev);
                    prev.nodes.push(node);
                    stack.push(node);
                } else {
                    let parent = stack.pop();
                    define(token, 'parent', parent);
                    parent.nodes.push(token);
                }
            } else {
                define(token, 'parent', prev);
                if (token.type !== 'inline') {
                    prev.nodes.push(token);
                }
            }
        });

        tokens.ast = ast;
        return tokens;
    };
}

function parseType(tok) {
    return /(.*?)_(open|close)$/.exec(tok.type);
}

function visit(node, fn) {
    fn(node);
    if (node.nodes || node.children) {
        mapVisit(node, fn);
    }
}

function mapVisit(node, fn) {
    var nodes = node.nodes || node.children;
    for (var i = 0; i < nodes.length; i++) {
        visit(nodes[i], fn);
    }
}

function define(obj, key, value) {
    Reflect.defineProperty(obj, key, {value});
}

/**
 * expose `prettify`
 */

module.exports = prettify;
