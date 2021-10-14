export const DEFAULT_DATE_FORMAT = 'YYYYMMDDHHmm';

export const DATE_REGEX = /(?<target>{{date:?(?<date>[^}]*)}})/g;

export const NEW_HEADER_TEMPLATE =`
date created: '{{date:YYYY-MM-DD HH:mm}}' 
`
export const UPDATE_HEADER_TEMPLATE =`
date updated: '{{date:YYYY-MM-DD HH:mm}}' 
`
export const DEFAULT_OPTIONS ={
    bullet: "-",
    fence: "~",
    emphasis: "_",
    rule: "-",
    fences: true,
    listItemIndent: "one",
    tightDefinitions: false,
    incrementListMarker: true,
    createHeaderIfNotPresent: false,
    newHeaderTemplate: NEW_HEADER_TEMPLATE,
    updateHeader: false,
    updateHeaderTemplate: UPDATE_HEADER_TEMPLATE,
    newlinesAroundHeadings: true
}