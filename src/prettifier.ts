import stringify from "remark-stringify";
import frontmatter from "remark-frontmatter";
import frontmatter_writer from './frontmatter-writer'
import type { MarkdownPrettifierOptions, FrontMatterOptions, FontmatterInput } from "./domain";

import {wikiLinkPlugin} from "./wikilinks";
import gfm from 'remark-gfm';
import math from 'remark-math'
import remark from "remark";


import { NEW_HEADER_TEMPLATE } from "./constants";

import moment from 'moment'

function prettifier(
  content: string,
  options: MarkdownPrettifierOptions = {    
    bullet: "-",
    fence: "~",
    emphasis: "_",
    rule: "-",
    fences: true,
    listItemIndent: "one",
    tightDefinitions:false,    
    incrementListMarker: true,
    createHeaderIfNotPresent: false,
    newHeaderTemplate: NEW_HEADER_TEMPLATE,
    updateHeader: true,
  },
  frontMatterData: FontmatterInput = { today: moment(), tags: [] }
) {

  let processor = remark()

  if (options.createHeaderIfNotPresent || options.updateHeader) {
    processor = processor
      .use(frontmatter)
      .use(frontmatter_writer, options as FrontMatterOptions, frontMatterData);
  }

  processor = processor
    .use(wikiLinkPlugin)
    .use(math)
    .use(gfm)
    .use(stringify, options);
    
  return processor.process(content);
}

export default prettifier
