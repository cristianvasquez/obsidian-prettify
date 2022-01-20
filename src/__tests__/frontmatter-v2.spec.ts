import frontmatter from "../frontmatter";
import moment from "moment";
const fixed_date = moment("2010-06-09T15:20:00-07:00");

test("createHeaderIfNotPresent: false", () => {
  const content = `No Header`;
  return frontmatter(
    content,
    { createHeaderIfNotPresent: false },
    { today: fixed_date }
  ).then((data) => {
    expect(data).toMatchSnapshot();
  });
});

test("createHeaderIfNotPresent: true", () => {
  const content = `No Header`;
  return frontmatter(
    content,
    {
      createHeaderIfNotPresent: true,
    },
    { today: fixed_date }
  ).then((data) => {
    expect(data).toMatchSnapshot();
  });
});

test("createHeaderIfNotPresent: true", () => {
  const content = `No Header`;
  const newHeaderTemplate =`
id: {{UUID}}
`

  return frontmatter(
      content,
      {
        createHeaderIfNotPresent: true,
        newHeaderTemplate: newHeaderTemplate
      },
      { today: fixed_date }
  ).then((data) => {
    expect(data).not.toContain('id: {{UUID}}')
  });
});

test("Do not update if it's a new header", () => {
  const content = `No Header`;
  return frontmatter(
      content,
      {
        createHeaderIfNotPresent: true,
        updateHeader:true
      },
      { today: fixed_date }
  ).then((data) => {
    expect(data).toMatchSnapshot();
  });
});

test("Creates date first time", () => {
  const content = `No Header`;
  return frontmatter(
    content,
    {
      createHeaderIfNotPresent: true,
      updateHeader: false,
    },
    { today: fixed_date }
  ).then((data) => {
    expect(data).toMatchSnapshot();
  });
});

test("Does not create header if update but not create", () => {
  const content = `No Header`;
  return frontmatter(
      content,
      {
        createHeaderIfNotPresent: false,
        updateHeader: true,
      },
      { today: fixed_date }
  ).then((data) => {
    expect(data).toMatchSnapshot();
  });
});


test("Does not modify date", () => {
  const content = `---
date updated: '1999-06-10T00:20:00+02:00'

---`;
  return frontmatter(
    content,
    {
      updateHeader: false,
    },
    { today: fixed_date }
  ).then((data) => {
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
  - 'quotes'
---
# A header

some text
            `;
  return frontmatter(content, {}, { today: fixed_date }).then((data) => {
    expect(data).toMatchSnapshot();
  });
});

test("Respects hash", () => {
  const content = `---
tag: '#Interpretability'

---
            `;
  return frontmatter(content, {}, { today: fixed_date }).then((data) => {
    expect(data).toMatchSnapshot();
  });
});

test("Respects emojis", () => {
  const content = `---
tag: '#🦐'

---🦐
            `;
  return frontmatter(content, {}, { today: fixed_date }).then((data) => {
    expect(data).toMatchSnapshot();
  });
});

test("add quote", () => {
  const content = `---
tag: #hello

---
            `;
  return frontmatter(
    content,
    {},
    {
    }
  ).then((data) => {
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
  return frontmatter(content, {}, { today: fixed_date }).then((data) => {
    expect(data).toMatchSnapshot();
  });
});

it("Adds tags", () => {
  const content = `---
Name: 
 - #Hi
---


`;
  return frontmatter(
    content,
    {},
    { today: fixed_date, tags: ["#hello", "#world"] }
  ).then((data) => {
    expect(data).toMatchSnapshot();
  });
});

it("Preserve previous tags", () => {
  const content = `---
tags: 
 - #preserve_me
---

`;
  return frontmatter(
    content,
    {},
    { today: fixed_date, tags: ["#hello", "#world"] }
  ).then((data) => {
    expect(data).toMatchSnapshot();
  });
});

it("Preserve previous tags", () => {
  const content = `---
date updated: '2020-12-09T00:14:06+01:00'

tags: '#literatura'

---
`;
  return frontmatter(content, {}, { today: fixed_date, tags: [] }).then(
    (data) => {
      expect(data).toMatchSnapshot();
    }
  );
});



it("Preserve previous tags", () => {
const content = `---
date: 2021-02-05--5pmt5:20:48:42

---`;
  return frontmatter(content, {}, { today: fixed_date, tags: [] }).then(
    (data) => {
      expect(data).toMatchSnapshot();
    }
  );
});

// UUID


it("Adds a new UUID, existing frontmatter", () => {
  const content = `---
date: 2021-02-05--5pmt5:20:48:42
---`;
  return frontmatter(content, {}, {
    today: fixed_date,
    tags: [],
    addUUIDIfNotPresent: true
  }).then(
      (data) => {
        expect(data).toMatchSnapshot();
      }
  );
});

it("Adds a new UUID", () => {
  const content = `
  No FrontMatter 
  `;
  return frontmatter(content, {
    createHeaderIfNotPresent: true
  }, {
    today: fixed_date,
    tags: [],
    addUUIDIfNotPresent: true
  }).then(
      (data) => {
        expect(data).toMatchSnapshot();
      }
  );
});

it("Adds a new UUID, newHeaderTemplate", () => {
  const content = `
  No FrontMatter  
  `;
  return frontmatter(content, {
    createHeaderIfNotPresent:true,
    newHeaderTemplate: ''
  }, {
    tags: [],
    addUUIDIfNotPresent: true
  }).then(
      (data) => {
        expect(data).toMatchSnapshot();
      }
  );
});


it("maintain UUID", () => {
  const content = `---
date: 2021-02-05--5pmt5:20:48:42
id: alreadyPresent
---`;
  return frontmatter(content, {}, {
    today: fixed_date,
    tags: [],
    addUUIDIfNotPresent: false
  }).then(
      (data) => {
        expect(data).toMatchSnapshot();
      }
  );
});

it("Multiple fences", () => {
  const content = `---
date: 2021-02-05--5pmt5:20:48:42
id: alreadyPresent
---
---
other: something else
---
`;
  return frontmatter(content, {}, {
    today: fixed_date,
    tags: [],
    addUUIDIfNotPresent: false
  }).then(
      (data) => {
        expect(data).toMatchSnapshot();
      }
  );
});


it("No newHeaderTemplate", () => {
  const content = `
  No FrontMatter  
  `;
  return frontmatter(content, {
    createHeaderIfNotPresent:false,
    newHeaderTemplate: ''
  }, {
    tags: [],
    addUUIDIfNotPresent: true
  }).then(
      (data) => {
        expect(data).toMatchSnapshot();
      }
  );
});
