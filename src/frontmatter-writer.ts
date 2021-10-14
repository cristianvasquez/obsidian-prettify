import jsYaml from 'js-yaml'

import { VFile } from "vfile";


// @TODO, find the typescript definitions for ast .. I've been searching the entire Internet, but I cannot find the one that uses children.

import Templates from "./templates";
const template = new Templates();
import type {
  FrontMatterOptions,
  FontmatterInput,
} from "./domain";

/**
 * Returns the transformer which acts on the MDAST tree and given VFile.
 *
 * @link https://github.com/unifiedjs/unified#function-transformernode-file-next
 * @link https://github.com/syntax-tree/mdast
 * @link https://github.com/vfile/vfile
 * @return {function}
 */

function metadataWriter(
  options: FrontMatterOptions,
  input: FontmatterInput
) {
  //@ts-ignore
  let transformer = (ast, vFile: VFile, next: any) => {
    let metadataNode = getMetadataNode(ast);
    let hasMetadata = !(metadataNode == null);

    // If we don't have a Matter node in the AST, put it in.
    if (!hasMetadata && options.createHeaderIfNotPresent) {
      metadataNode = {
        type: "yaml",
        value: jsYaml.dump(newHeaderTemplateYAML(options.newHeaderTemplate, input)),
      };
      ast.children.unshift(metadataNode);
      hasMetadata = true;
    } else {
      // Only updates if frontmatter already created
      if (options.updateHeader && hasMetadata) {
        // Write metadata (by reference)
        metadataNode.value = mergeValues(
            metadataNode.value,
            newHeaderTemplateYAML(options.updateHeaderTemplate, input)
        );
      }
    }

    if (typeof next === "function") {
      return next(null, ast, vFile);
    }

    return ast;
  };

  return transformer;
}

function newHeaderTemplateYAML(newHeaderTemplate:string, frontMatterData: FontmatterInput) {
  // Update dates and times
  if (frontMatterData.today) {
    newHeaderTemplate = String(
      template.replace(newHeaderTemplate, frontMatterData.today)
    );
  }

  // Add things like new tags
  let resultYaml: any = jsYaml.load(newHeaderTemplate);
  if (frontMatterData.tags) {
    resultYaml.tags = frontMatterData.tags;
  }
  // Return a map
  return resultYaml;
}

//@ts-ignore
function getMetadataNode(ast, types = ["yaml", "toml"]) {
  //@ts-ignore
  return ast.children.find((node) => types.includes(node.type));
}


function mergeValues(currentValues: any, newValues: any) {
  // put quotes around the
  // - #value
  //
  // and tags: #value
  // and tag: #value
  currentValues = currentValues.replace(
    /(^|-\s|tags:\s|tag:\s)(#[a-z//\d-_]+)/gi,
    "$1'$2'"
  );

  let fm: any = jsYaml.load(currentValues);

  // Calculate the union of tags
  let currentTags = [];
  if (fm.tags) {
    currentTags = fm.tags;
  }
  let newTags = [];
  if (newValues.tags) {
    newTags = newValues.tags;
  }

  if (typeof currentTags === "string" || currentTags instanceof String) {
    currentTags = [currentTags];
  }

  if (typeof newTags === "string" || newTags instanceof String) {
    newTags = [newTags];
  }


  let tagUnion: any = Array.from(
    new Set([...currentTags, ...newTags]).values()
  );   

  // Assign all new values
  if (fm) {
    Object.assign(fm, newValues);
  } else {
    fm = newValues;
  }

  fm.tags = tagUnion;

  if (fm.tags.length === 0) {
    delete fm.tags;
  }

  // stringify
  return jsYaml.dump(fm); // eslint-disable-line no-param-reassign
}


export default metadataWriter
