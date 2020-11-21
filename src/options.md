options.bullet
Marker to use to for bullets of items in unordered lists ('*', '+', or '-', default: '*').

options.closeAtx
Whether to add the same number of number signs (#) at the end of an ATX heading as the opening sequence (boolean, default: false).

options.emphasis
Marker to use to serialize emphasis ('*' or '_', default: '*').

options.fence
Marker to use to serialize fenced code ('`' or '~', default: '`').

options.fences
Whether to use fenced code always (boolean, default: false). The default is to fenced code if there is a language defined, if the code is empty, or if it starts or ends in empty lines.

options.incrementListMarker
Whether to increment the value of bullets of items in ordered lists (boolean, default: true).

options.listItemIndent
Whether to indent the content of list items with the size of the bullet plus one space (when 'one') or a tab stop ('tab'), or depending on the item and its parent list ('mixed', uses 'one' if the item and list are tight and 'tab' otherwise) ('one', 'tab', or 'mixed', default: 'tab').

options.quote
Marker to use to serialize titles ('"' or "'", default: '"').

options.rule
Marker to use for thematic breaks ('*', '-', or '_', default: '*').

options.ruleRepeat
Number of markers to use for thematic breaks (number, default: 3, min: 3).

options.ruleSpaces
Whether to add spaces between markers in thematic breaks (boolean, default: false).
options.setext

Whether to use setext headings when possible (boolean, default: false). Setext headings are not possible for headings with a rank more than 2 or when they’re empty.
options.strong

Marker to use to serialize strong ('*' or '_', default: '*').

options.tightDefinitions
Whether to join definitions w/o a blank line (boolean, default: false). Shortcut for a join function like so:
