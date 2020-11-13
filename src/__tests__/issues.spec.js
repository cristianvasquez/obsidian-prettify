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

    test("https://github.com/cristianvasquez/obsidian-prettify/issues/1", () => {

        const mock = `# issues/1
Prettifier:
- [ ] Don't break my TODO`
        expect(parseContents(mock)).toMatchSnapshot();
    });

    test("https://github.com/cristianvasquez/obsidian-prettify/issues/1", () => {

        const mock = `# issues/1

1. fjlkefjl
    1. feafe
2. feafea
3. feaf
    1. fea
3. fefe`

        expect(parseContents(mock)).toMatchSnapshot();
    });

});
