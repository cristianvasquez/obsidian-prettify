const prettifier = require('../prettifier')

// @TODO
// Read with base __DIRNAME
// run_spec(__dirname, ["markdown"], { proseWrap: "always" });


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

test("Embed youtube TODO", () => {
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

test("Can generate metadata table", () => {
    const content = `
# What the Semantic Web ignores
    
The Web is not only about facts,
It's about humans communicating all sorts of things.
In their own language, with their own model of the world.

perhaps 1% ? of the humans use it for facts?
            `
    return prettifier(content, {addMetadataTable: true},{
        title:'The immortality of the crab'
    }).then(data => {
        expect(data).toMatchSnapshot();
    });
});
