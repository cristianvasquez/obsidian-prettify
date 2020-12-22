# Markdown prettifier for Obsidian

Tries to fix and reformat ugly Markdown and adds things like 'modified date' etc.

The default hotkey is `Ctrl+Alt+L`.

## Examples

### Add a frontmatter

Before:

```markdown

I wrote this, but I don't remember when!

```

After:

```markdown
---
date updated: '2020-11-23T16:47:37+01:00'
---

I wrote this, but I don't remember when!

```

### Autolink literals

**Example**

Before:

```markdown
www.example.com, https://example.com, and contact@example.com.
```

After:

```markdown
[www.example.com](http://www.example.com), <https://example.com>, and <contact@example.com>.
```

### Ordered lists

Normalizes ordered lists.

**Example**

Before:

```markdown
1. foo
    1. aaa
    1. bbb
    4. ccc
1. bar
1. baz
```

After:

```markdown
1.  foo
    1.  aaa
    2.  bbb
    3.  ccc
2.  bar
3.  baz
```

### Tables

Normalizes table formatting.

**Example**

Before:

```markdown
**A**|**B**|**C**
|---:|:---|---|
a |b |c
x |y |z
```

After:

```markdown
| **A** | **B** | **C** |
| ----: | :---- | ----- |
|     a | b     | c     |
|     x | y     | z     |
```

## This plugin uses the following amazing libraries

-   [remark](https://github.com/remarkjs/remark)
-   [remark-gfm](https://github.com/remarkjs/remark-gfm#readme)
-   [remark-images](https://github.com/remarkjs/remark-images)
-   [remark-frontmatter](https://github.com/wooorm/remark-frontmatter)

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

## Manual installation

Download zip archive from [GitHub releases page](https://github.com/cristianvasquez/obsidian-prettify/releases).
Extract the archive into `<vault>/.obsidian/plugins`.

Alternatively, using bash:

```bash
OBSIDIAN_VAULT_DIR=/path/to/your/obsidian/vault
mkdir -p $OBSIDIAN_VAULT_DIR/.obsidian/plugins
unzip ~/Downloads/obsidian-prettify-0.1.zip -d $OBSIDIAN_VAULT_DIR/.obsidian/plugins
```

## Version History

### v.0.0.6

Fixed frontmatter bug

### v.0.0.5

Added indent for lists
Sets settings as recommended

### v.0.0.4

Fixed a bug that escaped \\
Added some feedback to the user

### v0.0.3

Enabled frontmatter and settings!

Included: [remark-frontmatter](https://github.com/wooorm/remark-frontmatter)

### v0.0.2

Added tests!

Included: [remark-gfm](https://github.com/remarkjs/remark-gfm#readme) and [remark-images](https://github.com/remarkjs/remark-images)

### v0.0.1

Initial Release, just playing around for the first time with Obsidian and the plugins. No settings, Just the minimum possible

---

Pull requests are both welcome and appreciated. :)

> if you want, you can also send me a coffee <https://www.buymeacoffee.com/pelado>
