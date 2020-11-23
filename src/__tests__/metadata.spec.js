const prettifier = require('../prettifier')

test("Creates a header", () => {
    const content = `No Header`
    return prettifier(content, {
        alwaysCreateHeader: true,
        lastModifiedAt: 'Sun, 21 Nov 2020 21:34:48 GMT'
    }).then(data => {
        expect(data).toMatchSnapshot();
    });
});


test("Maintains properties in header", () => {
    const content = `---
title: 'Example'
list:
  - oneX
  - 0
  - false
---
# What the Semantic Web ignores
    
The Web is not only about facts,
It's about humans communicating all sorts of things.
In their own language, with their own model of the world.

perhaps 1% ? of the humans use it for facts?
            `
    return prettifier(content, {
        lastModifiedAt: 'Sun, 21 Nov 2020 21:34:48 GMT'
    }).then(data => {
        expect(data).toMatchSnapshot();
    });
});


test("Respects hash", () => {
    const content = `---
tag: '#Interpretability'
---
            `
    return prettifier(content, {
        lastModifiedAt: 'Sun, 21 Nov 2020 21:34:48 GMT'
    }).then(data => {
        expect(data).toMatchSnapshot();
    });
});




