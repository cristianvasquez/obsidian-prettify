import {Options} from "mdast-util-to-markdown";


type FrontMatterOptions = {
  newHeaderTemplate?:any;
  updateHeaderTemplate?: any;
  createHeaderIfNotPresent?: boolean;
  updateHeader?: boolean;
}

type FontmatterInput = {
  tags?: string[];
  today?: moment.Moment;
};

type CustomOptions = {
   newlinesAroundHeadings?: boolean;
}

type MarkdownPrettifierOptions = Options & FrontMatterOptions & CustomOptions;


export type { MarkdownPrettifierOptions, FontmatterInput, FrontMatterOptions};