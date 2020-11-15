const prettifier = require('../prettifier')


// @TODO
// Read with base __DIRNAME
// run_spec(__dirname, ["markdown"], { proseWrap: "always" });

describe("issues", () => {


    test("https://github.com/cristianvasquez/obsidian-prettify/issues/1", () => {
        const content = `
# issues/1

Prettifier:
- [ ] Don't break my TODO
            `
        return prettifier(content).then(data => {
            expect(data).toMatchSnapshot();
        });
    });

    test("https://github.com/cristianvasquez/obsidian-prettify/issues/1", () => {
        const content = `
# issues/1

1. fjlkefjl
    1. feafe
2. feafea
3. feaf
    1. fea
3. fefe
            `
        return prettifier(content).then(data => {
            expect(data).toMatchSnapshot();
        });
    });

});
