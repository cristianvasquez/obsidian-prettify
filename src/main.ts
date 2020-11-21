import {App, MarkdownView, Plugin, PluginSettingTab, Setting} from "obsidian";

// @ts-ignore
import prettifier from "./prettifier"

//https://github.com/cristianvasquez/obsidian-prettify/projects/1#card-49299670
export default class MarkdownPrettifier extends Plugin {
    setting: MarkdownPrettifierSettings;

    onInit() {
    }

    async onload() {
        console.log("Loading Markdown-Prettifier");

        this.setting = (await this.loadData()) || new MarkdownPrettifierSettings();
        this.addSettingTab(new MarkdownPrettifierSettingsTab(this.app, this));

        this.addCommand({
            id: "markdown-prettifier",
            name: "Run",
            callback: () => this.runPrettifier(),
            hotkeys: [
                {
                    modifiers: ["Mod", "Alt"],
                    key: "l",
                },
            ],
        });
    }

    onunload() {
        console.log("Unload Markdown-Prettifier");
    }

    runPrettifier() {
        const view = this.app.workspace.activeLeaf.view;
        if (view instanceof MarkdownView) {
            // Do work here
            const editor = view.sourceMode.cmEditor;

            let text = editor.getSelection()

            // Nothing selected, fall back to select all.
            if (text == '') {
                editor.execCommand('selectAll')
                text = editor.getSelection()
            }

            prettifier(text).then(data => {
                editor.replaceSelection(String(data), "start")
            }).catch((err) => (console.error(err)));

        }
    }
}

class MarkdownPrettifierSettings {
     bulletSymbol = '*';
    // secondNumber = 5;
}

class MarkdownPrettifierSettingsTab extends PluginSettingTab {
    plugin: MarkdownPrettifier;

    constructor(app: App, plugin: MarkdownPrettifier) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const {containerEl} = this;
        const settings = this.plugin.setting;
        new Setting(containerEl)
            .setName("First setting")
            .setDesc(
                "Explanation for the first setting."
            )
            .addText((text) =>
                text.setValue(String(settings.bulletSymbol)).onChange((value) => {
                    settings.bulletSymbol = value;
                    this.plugin.saveData(settings);
                })
            );

        // new Setting(containerEl)
        //     .setName("Second number")
        //     .setDesc("I don't know yet the purpose of this second number.")
        //     .addText((text) =>
        //         text.setValue(String(settings.firstNumber)).onChange((value) => {
        //             if (!isNaN(Number(value))) {
        //                 settings.secondNumber = Number(value);
        //                 this.plugin.saveData(settings);
        //             }
        //         })
        //     );

    }
}
