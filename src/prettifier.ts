import frontmatter from "remark-frontmatter";
import frontmatter_writer from './frontmatter-writer'
import type {MarkdownPrettifierOptions, FrontMatterOptions, FontmatterInput} from "./domain";

import {wikiLinkPlugin} from "./wikilinks";
import gfm from 'remark-gfm';
import math from 'remark-math'
import remark from "remark";

import toMarkdown from './mdast-util-to-markdown-patch'

import {NEW_HEADER_TEMPLATE, UPDATE_HEADER_TEMPLATE, DEFAULT_OPTIONS} from "./constants";

import moment from 'moment'


function prettifier(
    content: string,
    userOptions: MarkdownPrettifierOptions,
    frontMatterData: FontmatterInput = {today: moment(), tags: []}
) {
    let options = {...DEFAULT_OPTIONS, ...userOptions};


    let processor = remark()

    if (options.createHeaderIfNotPresent || options.updateHeader) {
        processor = processor
            .use(frontmatter)
            .use(frontmatter_writer, options as FrontMatterOptions, frontMatterData);
    }

    const stringifyOptions = Object.assign({}, options)

    if (!stringifyOptions.newlinesAroundHeadings) {
        stringifyOptions.join = [
            //@ts-ignore
            (left, right) => {
                if (left.type === 'heading' || right.type === 'heading') {
                    return 0;
                }
                return 1;
            },
        ];
    }

    processor = processor
        .use(wikiLinkPlugin)
        .use(math)
        .use(gfm)
        // @ts-ignore
        .use(stringify, stringifyOptions);

    return processor.process(content);
}


function stringify(options: any) {
    var self = this
    this.Compiler = compile

    function compile(tree: any) {
        return toMarkdown(
            tree,
            Object.assign({}, self.data('settings'), options, {
                extensions: self.data('toMarkdownExtensions') || []
            })
        )
    }
}


export default prettifier
