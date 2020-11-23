const jsYaml = require('js-yaml');
const moment = require('moment')
const {NEW_HEADER_TEMPLATE} = require('../constants');
const Templates = require('../template')
const template = new Templates();

/**
 * Returns the transformer which acts on the MDAST tree and given VFile.
 *
 * @link https://github.com/unifiedjs/unified#function-transformernode-file-next
 * @link https://github.com/syntax-tree/mdast
 * @link https://github.com/vfile/vfile
 * @return {function}
 */
function metadataWriter({
                            createHeaderIfNotPresent = false,
                            newHeaderTemplate = NEW_HEADER_TEMPLATE,
                            updateHeader = false,
                            currentMoment = moment(),
                        } = {}) {

    return function transformer(ast, vFile, next) {

        let metadataNode = getMetadataNode(ast);
        let hasMetadata = !(metadataNode == null)

        // If we don't have a Matter node in the AST, put it in.
        if (!hasMetadata && createHeaderIfNotPresent) {
            metadataNode = {
                type: 'yaml',
                value: jsYaml.dump(getFreshProperties(newHeaderTemplate, currentMoment)),
            };
            ast.children.unshift(metadataNode);
            hasMetadata = true
        }

        if (updateHeader && hasMetadata) {
            // Write metadata (by reference)
            metadataNode.value = updatedValue(metadataNode.value, getFreshProperties(newHeaderTemplate, currentMoment));
        }

        if (typeof next === 'function') {
            return next(null, ast, vFile);
        }

        return ast;
    };
}

function getFreshProperties(newHeaderTemplate, moment) {
    return jsYaml.load(String(template.replace(newHeaderTemplate, moment)));
}

function getMetadataNode(ast, types = ['yaml', 'toml']) {
    return ast.children.find(node => types.includes(node.type));
}


function updatedValue(value, meta) {
    let fm = jsYaml.load(value)
    if (fm) {
        Object.assign(fm, meta);
    } else {
        fm = meta
    }
    // stringify
    return jsYaml.dump(fm); // eslint-disable-line no-param-reassign
}


module.exports = metadataWriter;
