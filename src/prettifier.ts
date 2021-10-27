import frontmatter from "remark-frontmatter";
import frontmatter_writer from './frontmatter-writer'
import type {FontmatterInput, FrontMatterOptions, MarkdownPrettifierOptions} from "./domain";

import {wikiLinkPlugin} from "./wikilinks";
import gfm from 'remark-gfm';
import math from 'remark-math'
import remark from "remark";

import toMarkdown from './mdast-util-to-markdown-patch'

import {DEFAULT_OPTIONS} from "./constants";

import moment from 'moment'


function prettifier(
    content: string,
    userOptions: MarkdownPrettifierOptions,
    frontMatterData: FontmatterInput
) {
    let options = {...DEFAULT_OPTIONS, ...userOptions};
    let processor = remark()

    if (options.createHeaderIfNotPresent || options.updateHeader) {
        processor = processor
            .use(frontmatter)
            .use(frontmatter_writer, options as FrontMatterOptions, {
                ...{
                    today: moment(),
                    tags: []
                }, ...frontMatterData
            });
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
