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
                            frontMatterData = {today: moment(), tags: []},
                        } = {}) {

    return function transformer(ast, vFile, next) {

        let metadataNode = getMetadataNode(ast);
        let hasMetadata = !(metadataNode == null)

        // If we don't have a Matter node in the AST, put it in.
        if (!hasMetadata && createHeaderIfNotPresent) {
            metadataNode = {
                type: 'yaml',
                value: jsYaml.dump(newValues(newHeaderTemplate, frontMatterData)),
            };
            ast.children.unshift(metadataNode);
            hasMetadata = true
        }

        if (updateHeader && hasMetadata) {
            // Write metadata (by reference)
            metadataNode.value = mergeValues(metadataNode.value, newValues(newHeaderTemplate, frontMatterData));
        }

        if (typeof next === 'function') {
            return next(null, ast, vFile);
        }

        return ast;
    };
}

function newValues(newHeaderTemplate, frontMatterData) {

    // Update dates and times
    if (frontMatterData.today) {
        newHeaderTemplate = String(template.replace(newHeaderTemplate, frontMatterData.today))
    }

    // Add things like new tags
    let resultYaml = jsYaml.load(newHeaderTemplate);
    if (frontMatterData.tags) {
        resultYaml.tags = frontMatterData.tags
    }
    // Return a map
    return resultYaml;
}

function getMetadataNode(ast, types = ['yaml', 'toml']) {
    return ast.children.find(node => types.includes(node.type));
}


function mergeValues(currentValues, newValues) {

    // put quotes around the
    // - #value
    //
    // and tags: #value
    // and tag: #value
    currentValues = currentValues.replace(/(^|-\s|tags:\s|tag:\s)(#[a-z//\d-_]+)/ig, "$1'$2'");

    let fm = jsYaml.load(currentValues)


    // Calculate the union of tags
    let currentTags = []
    if (fm.tags) {
        currentTags = fm.tags
    }
    let newTags = []
    if (newValues.tags) {
        newTags = newValues.tags
    }

    if (typeof currentTags === 'string' || currentTags instanceof String) {
        currentTags = [currentTags]
    }

    if (typeof newTags === 'string' || newTags instanceof String) {
        newTags = [newTags]
    }


    let tagUnion = [...new Set([...currentTags, ...newTags])];

    // Assign all new values
    if (fm) {
        Object.assign(fm, newValues);
    } else {
        fm = newValues
    }

    fm.tags = tagUnion

    if (fm.tags.length === 0) {
        delete fm.tags
    }

    // stringify
    return jsYaml.dump(fm); // eslint-disable-line no-param-reassign
}


module.exports = metadataWriter;
