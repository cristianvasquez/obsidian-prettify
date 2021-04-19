import {Options} from "mdast-util-to-markdown";


type FrontMatterOptions = {
  newHeaderTemplate?: any;
  createHeaderIfNotPresent?: boolean;
  updateHeader?: boolean;
}

type FontmatterInput = {
  tags?: string[];
  today?: moment.Moment;
};

type MarkdownPrettifierOptions = Options & FrontMatterOptions


export type { MarkdownPrettifierOptions, FontmatterInput, FrontMatterOptions};