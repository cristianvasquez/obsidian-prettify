const DEFAULT_DATE_FORMAT = 'YYYYMMDDHHmm';
const DATE_REGEX = /(?<target>{{date:?(?<date>[^}]*)}})/g;

const NEW_HEADER_TEMPLATE =`
date updated: '{{date:YYYY-MM-DDTHH:mm:ssZ}}' 
`

module.exports = {
    NEW_HEADER_TEMPLATE: NEW_HEADER_TEMPLATE,
    DATE_REGEX: DATE_REGEX,
    DEFAULT_DATE_FORMAT: DEFAULT_DATE_FORMAT
}
