import prettifier from "../prettifier";
import {MarkdownPrettifierOptions} from '../domain'
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

  test("https://github.com/cristianvasquez/obsidian-prettify/issues/35", () => {

    const content = `$$\begin{aligned}
		& y_{it} = \mu_i + x_{it}
		\\
		& x_{it} = \phi_i x_{i,t-1} + e_{it}
\end{aligned}$$`;
    return prettifier(content, {
      listItemIndent: "one",
    
    }).then((data) => {
      expect(data.contents).toMatchSnapshot();
    });
  });

  test("https://github.com/cristianvasquez/obsidian-prettify/issues/47", () => {
    const content = `$x + y$

$$x + y$$`;
    return prettifier(content, {
      listItemIndent: "one",
    }).then((data) => {
      expect(data.contents).toMatchSnapshot();
    });
  });

  test("https://github.com/cristianvasquez/obsidian-prettify/issues/49", () => {
    const content = `
\#12
#12
`;
    return prettifier(content, {
      listItemIndent: "one",
    }).then((data) => {
      expect(data.contents).toMatchSnapshot();
    });
  });

  test("https://github.com/cristianvasquez/obsidian-prettify/issues/20", () => {
    const content = `
| A title           | B title |
| -------           | ------- |
| [[ link | alias]] | B row |
`;
    return prettifier(content, {
      listItemIndent: "one",
    }).then((data) => {
      expect(data.contents).toMatchSnapshot();
    });
  });
});
