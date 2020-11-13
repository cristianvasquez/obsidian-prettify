// @ts-nocheck
const Remarkable = require("remarkable");
const prettify = require("../index");

function parseContents(
    content,
    settings = {}
) {
    return new Remarkable.Remarkable()
        .use(prettify)
        .render(content);
}

describe("basic", () => {
    const content = require("../mockData");

    test("Basic functionality: tables", () => {
        expect(parseContents(
            `
## Tables

**A**|**B**|**C**
|---:|:---|---|
a |b |c
x |y |z
            `
        )).toMatchSnapshot();
    });


    test("Basic functionality: alternate lists", () => {
        expect(parseContents(
            `
## List alternation

* a
* b
  * c
  * d
    * e
    * f
            `
        )).toMatchSnapshot();
    });

    test("Basic functionality: enumerate lists", () => {
        expect(parseContents(
            `
## Lists numbering

1. foo
  a. aaa
  b. bbb
  c. ccc
1. bar
1. baz
            `
        )).toMatchSnapshot();
    });

    test("Basic functionality: handle links", () => {
        expect(parseContents(
            `
## Strange links

A link : [foo](bar){#baz}
`
        )).toMatchSnapshot();
    });


});
