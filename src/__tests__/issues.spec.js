const prettifier = require("../prettifier");

// @TODO
// Read with base __DIRNAME
// run_spec(__dirname, ["markdown"], { proseWrap: "always" });

describe("issues", () => {
  test("https://github.com/cristianvasquez/obsidian-prettify/issues/1", () => {
    const content = `
# issues/1

Prettifier:
- [ ] Don't break my TODO
            `;
    return prettifier(content).then((data) => {
      expect(data.contents).toMatchSnapshot();
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
            `;
    return prettifier(content).then((data) => {
      expect(data.contents).toMatchSnapshot();
    });
  });

  test("https://github.com/cristianvasquez/obsidian-prettify/issues/12", () => {
    const content = `
$$
\begin{bmatrix}
a && b \\
c && d
\end{bmatrix}
$$
            `;
    return prettifier(content).then((data) => {
      expect(data.contents).toMatchSnapshot();
    });
  });

  test("https://github.com/cristianvasquez/obsidian-prettify/issues/19", () => {
    const content = `
- X
    *   Tab
- X
    * Tab
- X
  * 2 spaces
- X
   * 3 spaces
- X
    * 4 Spaces
            `;
    return prettifier(content, {
      listItemIndent: "one",
    }).then((data) => {
      expect(data.contents).toMatchSnapshot();
    });
  });

  test("https://github.com/cristianvasquez/obsidian-prettify/issues/19", () => {
    const content = `
- X
    *   Tab
- X
    * Tab
- X
  * 2 spaces
- X
   * 3 spaces
- X
    * 4 Spaces
            `;
    return prettifier(content, {
      listItemIndent: "tab",
    }).then((data) => {
      expect(data.contents).toMatchSnapshot();
    });
  });
});
