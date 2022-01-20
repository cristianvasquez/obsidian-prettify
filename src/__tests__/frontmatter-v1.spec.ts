import prettifier from "../prettifier";
import moment from "moment";
const fixed_date = moment("2010-06-09T15:20:00-07:00");

test("Does not create a header", () => {
  const content = `No Header`;
  return prettifier(
    content,
    { createHeaderIfNotPresent: false },
    { today: fixed_date }
  ).then((data) => {
    expect(data.contents).toMatchSnapshot();
  });
});

test("Creates a header", () => {
  const content = `No Header`;
  return prettifier(
    content,
    {
      createHeaderIfNotPresent: true,
    },
    { today: fixed_date }
  ).then((data) => {
    expect(data.contents).toMatchSnapshot();
  });
});

test("Creates a header with an UUID", () => {
  const content = `No Header`;
  const newHeaderTemplate =`
id: {{UUID}}
`

  return prettifier(
      content,
      {
        createHeaderIfNotPresent: true,
        newHeaderTemplate: newHeaderTemplate
      },
      { today: fixed_date }
  ).then((data) => {
    expect(data.contents).not.toContain('id: {{UUID}}')
  });
});

test("Do not update if it's a new header", () => {
  const content = `No Header`;
  return prettifier(
      content,
      {
        createHeaderIfNotPresent: true,
        updateHeader:true
      },
      { today: fixed_date }
  ).then((data) => {
    expect(data.contents).toMatchSnapshot();
  });
});

test("Creates date first time", () => {
  const content = `No Header`;
  return prettifier(
    content,
    {
      createHeaderIfNotPresent: true,
      updateHeader: false,
    },
    { today: fixed_date }
  ).then((data) => {
    expect(data.contents).toMatchSnapshot();
  });
});

test("Does not create header if update but not create", () => {
  const content = `No Header`;
  return prettifier(
      content,
      {
        createHeaderIfNotPresent: false,
        updateHeader: true,
      },
      { today: fixed_date }
  ).then((data) => {
    expect(data.contents).toMatchSnapshot();
  });
});


test("Does not modify date", () => {
  const content = `---
date updated: '1999-06-10T00:20:00+02:00'

---`;
  return prettifier(
    content,
    {
      updateHeader: false,
    },
    { today: fixed_date }
  ).then((data) => {
    expect(data.contents).toMatchSnapshot();
  });
});

test("Maintains properties in header", () => {
  const content = `---
title: 'Example'
list:
  - oneX
  - 0
  - false
  - 'quotes'
---
# A header

some text
            `;
  return prettifier(content, {}, { today: fixed_date }).then((data) => {
    expect(data.contents).toMatchSnapshot();
  });
});

test("Respects hash", () => {
  const content = `---
tag: '#Interpretability'

---
            `;
  return prettifier(content, {}, { today: fixed_date }).then((data) => {
    expect(data.contents).toMatchSnapshot();
  });
});

test("Respects emojis", () => {
  const content = `---
tag: '#🦐'

---🦐
            `;
  return prettifier(content, {}, { today: fixed_date }).then((data) => {
    expect(data.contents).toMatchSnapshot();
  });
});

test("add quote", () => {
  const content = `---
tag: #hello

---
            `;
  return prettifier(
    content,
    {},
    {
    }
  ).then((data) => {
    expect(data.contents).toMatchSnapshot();
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
  return prettifier(content, {}, { today: fixed_date }).then((data) => {
    expect(data.contents).toMatchSnapshot();
  });
});

it("Adds tags", () => {
  const content = `---
Name: 
 - #Hi
---


`;
  return prettifier(
    content,
    {},
    { today: fixed_date, tags: ["#hello", "#world"] }
  ).then((data) => {
    expect(data.contents).toMatchSnapshot();
  });
});

it("Adds tags empty template", () => {
  const content = `---
Name: 
 - #Hi
---


`;
  return prettifier(
      content,
      {
        updateHeaderTemplate:''
      },
      { today: fixed_date, tags: ["#hello", "#world"] }
  ).then((data) => {
    expect(data.contents).toMatchSnapshot();
  });
});

it("Adds tags empty template", () => {
  const content = `---

No content
`;
  return prettifier(
      content,
      {
        createHeaderIfNotPresent:true,
        newHeaderTemplate:''
      },
      { today: fixed_date, tags: ["#hello", "#world"] }
  ).then((data) => {
    expect(data.contents).toMatchSnapshot();
  });
});

it("Preserve previous tags", () => {
  const content = `---
tags: 
 - #preserve_me
---


`;
  return prettifier(
    content,
    {},
    { today: fixed_date, tags: ["#hello", "#world"] }
  ).then((data) => {
    expect(data.contents).toMatchSnapshot();
  });
});

it("Preserve previous tags", () => {
  const content = `---
date updated: '2020-12-09T00:14:06+01:00'

tags: '#literatura'

---
`;
  return prettifier(content, {}, { today: fixed_date, tags: [] }).then(
    (data) => {
      expect(data.contents).toMatchSnapshot();
    }
  );
});



it("Preserve previous tags", () => {
const content = `---
date: 2021-02-05--5pmt5:20:48:42

---`;
  return prettifier(content, {}, { today: fixed_date, tags: [] }).then(
    (data) => {
      expect(data.contents).toMatchSnapshot();
    }
  );
});
