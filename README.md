# Markdown prettifier for Obsidian


![./img/screen_cast.gif](./img/screen_cast.gif)


Uses [remark-gfm](https://www.npmjs.com/package/remark-gfm) and others to beautify Markdown.

The default hotkey is `Ctrl+Alt+L`.

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

___
> if you want, you can send me a coffee :) https://www.buymeacoffee.com/pelado
