export const DEFAULT_DATE_FORMAT = 'YYYYMMDDHHmm';

export const DATE_REGEX = /(?<target>{{date:?(?<date>[^}]*)}})/g;

export const NEW_HEADER_TEMPLATE =`
date updated: '{{date:YYYY-MM-DD HH:mm}}' 
`
 