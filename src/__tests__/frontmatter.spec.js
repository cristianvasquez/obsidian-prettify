const prettifier = require('../prettifier')
const moment = require('moment')
const fixed_date = moment('2010-06-09T15:20:00-07:00')


test("Does not create a header", () => {
    const content = `No Header`
    return prettifier(content, {createHeaderIfNotPresent: false}, {}, {today: fixed_date}).then(data => {
        expect(data).toMatchSnapshot();
    });
});

test("Creates a header", () => {
    const content = `No Header`
    return prettifier(content,
        {
            createHeaderIfNotPresent: true
        }, {today: fixed_date}
    ).then(data => {
        expect(data).toMatchSnapshot();
    });
});

test("Creates date first time", () => {
    const content = `No Header`
    return prettifier(content,
        {
            createHeaderIfNotPresent: true,
            updateHeader: false,
        }, {today: fixed_date}).then(data => {
        expect(data).toMatchSnapshot();
    });
});

test("Does not modify date", () => {
    const content = `---
date updated: '1999-06-10T00:20:00+02:00'

---`
    return prettifier(content, {
        updateHeader: false,
    }, {today: fixed_date}).then(data => {
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
    return prettifier(content, {}
        , {today: fixed_date}).then(data => {
        expect(data).toMatchSnapshot();
    });
});


test("Respects hash", () => {
    const content = `---
tag: '#Interpretability'
---
            `
    return prettifier(content, {},
        {today: fixed_date}).then(data => {
        expect(data).toMatchSnapshot();
    });
});

test("Respects emojis", () => {
    const content = `---
tag: '#🦐'
---
🦐
            `
    return prettifier(content, {}, {today: fixed_date}).then(data => {
        expect(data).toMatchSnapshot();
    });
});


test("add quote", () => {
    const content = `---
tag: #hello
---
            `
    return prettifier(content, {}, {
        frontMatterData: {}
    }).then(data => {
        expect(data).toMatchSnapshot();
    });
});

it("Add quotes", () => {
    const content = `---
Name: 
 - #Hello
 - World
 - ' #Hi'
 - #with/tab
 - #with/tab/teb/tib
 - #howdy_bla
 - #howdy-bla
Other tag: #Nothing
tags: #Nothing
---

Outside frontmatter

#tag

`;
    return prettifier(content, {}, {today: fixed_date}).then(data => {
        expect(data).toMatchSnapshot();
    });
});


it("Adds tags", () => {
    const content = `---
Name: 
 - #Hi
---


`;
    return prettifier(content,
        {}, {today: fixed_date, tags: ['#hello', '#world']}).then(data => {
        expect(data).toMatchSnapshot();
    });
});

it("Preserve previous tags", () => {
    const content = `---
tags: 
 - #preserve_me
---


`;
    return prettifier(content,
        {}, {today: fixed_date, tags: ['#hello', '#world']}).then(data => {
        expect(data).toMatchSnapshot();
    });
});



it("Preserve previous tags", () => {
    const content = `---
date updated: '2020-12-09T00:14:06+01:00'

tags: '#literatura'

---
`
    return prettifier(content,
        {}, {today: fixed_date, tags: []}).then(data => {
        expect(data).toMatchSnapshot();
    });
});

