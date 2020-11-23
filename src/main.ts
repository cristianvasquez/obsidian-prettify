import {App, MarkdownView, Plugin, PluginSettingTab, Setting} from "obsidian";

/**
 * Being developed at: https://github.com/cristianvasquez/obsidian-prettify/projects/1
 */
// @ts-ignore
import prettifier from "./prettifier"
import {VIEW_TYPE_CALENDAR} from "../playground/obsidian-calendar-plugin/src/constants";

export default class MarkdownPrettifier extends Plugin {

    // This field stores your plugin settings.
    settings: MarkdownPrettifierSettings;

    onInit() {
    }

    async onload() {
        console.log("Loading Markdown-Prettifier");

        this.settings = (await this.loadData()) || new MarkdownPrettifierSettings();
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

            // Nothing selected, fall back to 'select all'.
            if (text == '') {
                editor.execCommand('selectAll')
                text = editor.getSelection()
            }

            prettifier(text, this.settings
            ).then(data => {
                editor.replaceSelection(String(data), "start")
            }).catch((err) => {
                    console.error(err)
                }
            );

        }
    }
}

/**
 * This is a data class that contains your plugin configurations. You can edit it
 * as you wish by adding fields and all the data you need.
 */
class MarkdownPrettifierSettings {
    bullet = '-'; // ('*', '+', or '-', default: '*'). Marker to use to for bullets of items in unordered lists
    emphasis = '_'; // ('*' or '_', default: '*'). Marker to use to serialize emphasis
    rule = '-'; // ('*', '-', or '_', default: '*'). Marker to use for thematic breaks
    createHeaderIfNotPresent = true;
    updateDatesInHeader = true;

}


class MarkdownPrettifierSettingsTab extends PluginSettingTab {
    plugin: MarkdownPrettifier;

    constructor(app: App, plugin: MarkdownPrettifier) {
        super(app, plugin);
        this.plugin = plugin;

    }

    display(): void {
        const {containerEl} = this;
        const settings = this.plugin.settings;

        containerEl.findAll('div')
            .forEach((leaf) => leaf.detach());

        // ('*', '+', or '-', default: '*'). Marker to use to for bullets of items in unordered lists
        new Setting(containerEl)
            .setName("bullet")
            .setDesc("Marker to use to for bullets of items in unordered lists")
            .addText((text) =>
                text.setValue(String(settings.bullet)).onChange((value) => {
                    settings.bullet = value;
                    this.plugin.saveData(settings);
                })
            );

        // ('*' or '_', default: '*'). Marker to use to serialize emphasis
        new Setting(containerEl)
            .setName("emphasis")
            .setDesc("Marker to use to serialize emphasis")
            .addText((text) =>
                text.setValue(String(settings.emphasis)).onChange((value) => {
                    settings.emphasis = value;
                    this.plugin.saveData(settings);
                })
            );

        // ('*', '-', or '_', default: '*'). Marker to use for thematic breaks
        new Setting(containerEl)
            .setName("emphasis")
            .setDesc("Marker to use to serialize emphasis")
            .addText((text) =>
                text.setValue(String(settings.rule)).onChange((value) => {
                    settings.rule = value;
                    this.plugin.saveData(settings);
                })
            );

        new Setting(this.containerEl)
            .setName("Add a frontmatter entry if is not present")
            .setDesc("")
            .addToggle((toggle) => {
                toggle.setValue(this.plugin.settings.createHeaderIfNotPresent);
                toggle.onChange(async (value) => {

                    settings.createHeaderIfNotPresent = value;
                    this.plugin.saveData(settings);
                    // this.plugin.saveData(
                    //     (old) => (old.createHeaderIfNotPresent = value)
                    // );
                });
            });

        new Setting(this.containerEl)
            .setName("Always update date")
            .setDesc("")
            .addToggle((toggle) => {
                toggle.setValue(this.plugin.settings.updateDatesInHeader);
                toggle.onChange(async (value) => {

                    settings.updateDatesInHeader = value;
                    this.plugin.saveData(settings);

                });
            });


    }
}
