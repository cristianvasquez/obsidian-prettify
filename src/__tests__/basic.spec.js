const prettifier = require('../prettifier')

test("Basic functionality: a formatted table", () => {
    const content = `
**A**|**B**|**C**
|---:|:---|---|
a |b |c
x |y |z
            `
    return prettifier(content).then(data => {
        expect(data).toMatchSnapshot();
    });
});


test("Basic functionality: lists use * bullets", () => {
    const content = `
- a
- b
  - c
  - d
    - e
    - f
            `
    return prettifier(content, {bullet: '*'}).then(data => {
        expect(data).toMatchSnapshot();
    });
});


test("Basic functionality: lists use - bullets", () => {
    const content = `
* a
* b
  * c
  * d
    * e
    * f
            `
    return prettifier(content).then(data => {
        expect(data).toMatchSnapshot();
    });
});


test("Basic functionality: alternating keeps information of different codification", () => {
    const content = `
- a
- b
  * c
  - d
    - e
    * f
            `
    return prettifier(content, {bullet: '*'}).then(data => {
        expect(data).toMatchSnapshot();
    });
});

test("Basic functionality: enumerate lists", () => {
    const content = `
1. foo
  a. aaa
  b. bbb
  c. ccc
1. bar
1. baz
            `
    return prettifier(content).then(data => {
        expect(data).toMatchSnapshot();
    });
});

test("Basic functionality: enumerate lists", () => {
    const content = `
1. foo
    1. aaa
    1. bbb
    4. ccc
1. bar
1. baz
            `
    return prettifier(content).then(data => {
        expect(data).toMatchSnapshot();
    });
});

test("Basic functionality: dont break obsidian links", () => {
    const content = `
[[respect this]]
    [[and this]][[also this]]
            `
    return prettifier(content).then(data => {
        expect(data).toMatchSnapshot();
    });
});

test("Embed youtube", () => {
    const content = `
https://www.youtube.com/watch?v=B6rKUf9DWRI
            `
    return prettifier(content).then(data => {
        expect(data).toMatchSnapshot();
    });
});

test("Embed image", () => {
    const content = `
https://cyberculturesblog.files.wordpress.com/2019/01/Memex.jpg
            `
    return prettifier(content).then(data => {
        expect(data).toMatchSnapshot();
    });
});


