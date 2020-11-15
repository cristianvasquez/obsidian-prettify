# Notes

## Remark

Out of the box, remark transforms Markdown: Markdown is given, reformatted, and written:

```
# Alpha #
Bravo charlie **delta** __echo__.
- Foxtrot
```

yields

```
# Alpha

Bravo charlie **delta** **echo**.

*   Foxtrot
```

## mdast

Repast uses [mdast](https://github.com/syntax-tree/mdast), which is a specification for representing Markdown in a syntax tree. 
It implements the unist spec. It can represent several flavours of Markdown, such as CommonMark and GitHub Flavored Markdown.

## unified 

is an interface for processing text using syntax trees. It’s what powers remark (Markdown), retext (natural language
), and rehype (HTML), and allows for processing between formats.

[unified](https://www.npmjs.com/package/unified) is an interface for processing text using syntax trees. It’s what powers remark (Markdown), retext
 (natural language), and rehype (HTML), and allows for processing between formats.





