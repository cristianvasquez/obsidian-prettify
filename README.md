# Markdown prettifier for Obsidian

Uses [pretty-remarkable](https://github.com/jonschlinkert/pretty-remarkable) to fix and reformat ugly Markdown.

The default hotkey is `Ctrl+Alt+L`.

you can prettify a selection or the whole document.

### Tables

Normalizes table formatting.

**Example**

```markdown
Before
**A**|**B**|**C**
|---:|:---|---|
a |b |c
x |y |z
After
```

Is normalized to:

```markdown
Before

| **A** | **B** | **C** | 
| ---: | :--- | --- |
| a | b | c |
| x | y | z |

After
```

### Unordered lists

Normalizes unordered lists.

**Example**

```markdown
* a
* b
  * c
  * d
    * e
    * f
```

Is normalized to:

```markdown
* a
* b
  - c
  - d
    + e
    + f
```

### Ordered lists

Normalizes ordered lists.

**Example**

```markdown
1. foo
  a. aaa
  b. bbb
  c. ccc
1. bar
1. baz

```

Is normalized to:

```markdown
1. foo
  a. aaa
  b. bbb
  c. ccc
2. bar
3. baz

```


## How to compile the plugin

First, install the dependencies with

```bash
npm i
```

Then, you can compile the plugin with:

```bash
npm run build
```

This will create a `main.js` file in the project root. That is the entry point of your plugin.
