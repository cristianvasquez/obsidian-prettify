const jsYaml = require('js-yaml');

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
                            updateDatesInHeader = false,
                            lastModifiedAt = undefined
                        } = {}) {

    return function transformer(ast, vFile, next) {

        let metadataNode = getMetadataNode(ast);

        let hasMetadata = !(metadataNode == null)
        if (!hasMetadata) {
            metadataNode = {
                type: 'yaml',
                value: '',
            };
            if (createHeaderIfNotPresent){
                // The first time a header it's added it comes with a date.
                lastModifiedAt = new Date().toUTCString()
            }
        }

        let propertiesToUpdate = {}

        if (lastModifiedAt) {
            // Some date defined by the caller
            propertiesToUpdate.lastModifiedAt = lastModifiedAt;
        } else if (updateDatesInHeader) {
            // Today's date
            propertiesToUpdate.lastModifiedAt = new Date().toUTCString();
        } else if (vFile.data.lastModifiedAt) {
            // The date that's on the document
            propertiesToUpdate.lastModifiedAt = vFile.data.lastModifiedAt
        }

        // Write metadata (by reference)
        metadataNode.value = updatedValue(metadataNode.value, propertiesToUpdate);

        // If we don't have a Matter node in the AST, put it in.
        if (!hasMetadata && createHeaderIfNotPresent) {
            ast.children.unshift(metadataNode);
        }

        if (typeof next === 'function') {
            return next(null, ast, vFile);
        }

        return ast;
    };
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
