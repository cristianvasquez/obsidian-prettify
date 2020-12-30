import {App, MarkdownView, Notice, Plugin, PluginSettingTab, Setting} from "obsidian";

// @ts-ignore
import Template from './template'
// @ts-ignore
import moment from 'moment'

/**
 * Being developed at: https://github.com/cristianvasquez/obsidian-prettify/projects/1
 */
// @ts-ignore
import prettifier from "./prettifier"

import {NEW_HEADER_TEMPLATE} from './constants'


interface MarkdownPrettifierSettings {
    bullet: string;
    emphasis: string;
    rule: string;
    createHeaderIfNotPresent: boolean;
    updateHeader: boolean;
    newHeaderTemplate: string;
    listItemIndent: string
}

const DEFAULT_SETTINGS: MarkdownPrettifierSettings = {
    bullet: '-', // ('*', '+', or '-', default: '*'). Marker to use to for bullets of items in unordered lists
    emphasis: '_', // ('*' or '_', default: '*'). Marker to use to serialize emphasis
    rule: '-', // ('*', '-', or '_', default: '*'). Marker to use for thematic breaks
    createHeaderIfNotPresent: true,
    updateHeader: true,
    newHeaderTemplate: NEW_HEADER_TEMPLATE,
    listItemIndent: 'one'
}


export default class MarkdownPrettifier extends Plugin {

    // This field stores your plugin settings.
    settings: MarkdownPrettifierSettings;

    onInit() {
    }

    async loadSettings() {
        this.settings = Object.assign(DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    async onload() {
        console.log("Loading Markdown-Prettifier");

        await this.loadSettings();

        this.addSettingTab(new MarkdownPrettifierSettingsTab(this.app, this));

        this.addCommand({
            id: "markdown-prettifier-run",
            name: "Run",
            callback: () => this.runPrettifier(),
            hotkeys: [
                {
                    modifiers: ["Mod", "Alt"],
                    key: "l",
                },
            ],
        });

        this.addCommand({
            id: "markdown-prettifier-update-fields",
            name: "Update fields",
            callback: () => this.updateMatters(),
            hotkeys: [
                {
                    modifiers: ["Mod", "Alt"],
                    key: "o",
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

            // Remember the cursor
            const cursor = editor.getCursor()

            editor.execCommand('selectAll')
            let text = editor.getSelection()

            prettifier(text, this.settings, {today: moment(), tags: []}
            ).then(data => {

                try {
                    // Calculate difference of lines and provide feedback
                    const n_before = String(data).split(/\r\n|\r|\n/).length
                    const n_after = String(text).split(/\r\n|\r|\n/).length
                    const lines_changed = n_before - n_after
                    if (lines_changed != 0) {
                        if (lines_changed > 0) {
                            new Notice("Prettifier: added " + lines_changed + " lines.");
                        } else {
                            new Notice("Prettifier: removed " + lines_changed + " lines.");
                        }
                    }
                    // Update the cursor
                    if (cursor.line) {
                        cursor.line = cursor.line + lines_changed
                    }

                } catch (err) {
                    console.error(err)
                }
                editor.replaceSelection(String(data), "start")
                editor.setCursor(cursor)

            }).catch((err) => {
                    console.error(err)
                    if (err.message) {
                        new Notice(err.message);
                    }
                }
            );

        }
    }

    updateMatters() {
        const view = this.app.workspace.activeLeaf.view;
        if (view instanceof MarkdownView) {
            // Do work here
            const editor = view.sourceMode.cmEditor;

            // Remember the cursor
            const cursor = editor.getCursor()

            editor.execCommand('selectAll')
            let text = editor.getSelection()

            let frontMatterData = {
                today: moment(),
                tags: new Template().findHashtags(text)
            }

            prettifier(text, this.settings, frontMatterData
            ).then(data => {
                editor.replaceSelection(String(data), "start")
                editor.setCursor(cursor)
                new Notice('Updated tags');
            }).catch((err) => {
                    console.error(err)
                    if (err.message) {
                        new Notice(err.message);
                    }
                }
            );

        }
    }
}


class MarkdownPrettifierSettingsTab extends PluginSettingTab {
    plugin: MarkdownPrettifier;

    constructor(app: App, plugin: MarkdownPrettifier) {
        super(app, plugin);
        this.plugin = plugin;

    }

    display(): void {
        const {containerEl} = this;
        containerEl.empty();

        const settings = this.plugin.settings;

        this.containerEl.createEl("h3", {
            text: "Prettyfication Settings",
        });

        // ('*', '+', or '-', default: '*'). Marker to use to for bullets of items in unordered lists
        new Setting(containerEl)
            .setName("bullet")
            .setDesc("Marker to use to for bullets of items in unordered lists")
            .addDropdown((dropdown) => {
                    dropdown.addOption("*", "* item");
                    dropdown.addOption("+", "+ item");
                    dropdown.addOption("-", "- item");
                    dropdown.setValue(String(settings.bullet))
                        .onChange(async (value) => {
                            this.plugin.settings.bullet = value;
                            await this.plugin.saveSettings();
                        })
                }
            );

        new Setting(containerEl)
            .setName("List indent")
            .setDesc("Whether to use one space or tab to indent lists")
            .addDropdown((dropdown) => {
                    dropdown.addOption('one', "one space");
                    dropdown.addOption('mixed', "mixed");
                    dropdown.addOption('tab', "tab");
                    dropdown.setValue(String(this.plugin.settings.listItemIndent))
                        .onChange(async (value) => {
                            this.plugin.settings.listItemIndent = value;
                            await this.plugin.saveSettings();
                        })
                }
            );

        // ('*' or '_', default: '*'). Marker to use to serialize emphasis
        new Setting(containerEl)
            .setName("emphasis")
            .setDesc("Marker to use to serialize emphasis")
            .addDropdown((dropdown) => {
                    dropdown.setValue(this.plugin.settings.emphasis);
                    dropdown.addOption("*", "*emphasis*");
                    dropdown.addOption("_", "_emphasis_");
                    dropdown.setValue(String(settings.emphasis)).onChange(async (value) => {
                        this.plugin.settings.emphasis = value;
                        await this.plugin.saveSettings();
                    })
                }
            );

        // ('*', '-', or '_', default: '*'). Marker to use for thematic breaks
        new Setting(containerEl)
            .setName("thematic rule")
            .setDesc("Marker to use for thematic breaks")
            .addDropdown((dropdown) => {
                    dropdown.setValue(this.plugin.settings.rule);
                    dropdown.addOption("*", "***");
                    dropdown.addOption("-", "---");
                    dropdown.addOption("_", "___");
                    dropdown.setValue(String(settings.rule)).onChange(async (value) => {
                        this.plugin.settings.rule = value;
                        await this.plugin.saveSettings();
                    })
                }
            );


        this.containerEl.createEl("h3", {
            text: "Header Settings",
        });

        new Setting(this.containerEl)
            .setName("Add new headers")
            .setDesc("Adds a new header if there isn't")
            .addToggle((toggle) => {
                toggle.setValue(this.plugin.settings.createHeaderIfNotPresent);
                toggle.onChange(async (value) => {
                    this.plugin.settings.createHeaderIfNotPresent = value;
                    await this.plugin.saveSettings();
                });
            });

        new Setting(containerEl)
            .setName('Header template')
            .setDesc(this.newHeaderTemplateHelp())
            .addTextArea((text) => {
                text
                    // .setPlaceholder("Example: {{date:YYYYMMDDHHmm}}-")
                    .setValue(this.plugin.settings.newHeaderTemplate || '')
                    .onChange(async (value) => {
                        this.plugin.settings.newHeaderTemplate = value;
                        this.updateTemplateExample();

                        if (new Template().isValidYaml(this.plugin.settings.newHeaderTemplate)) {
                            await this.plugin.saveSettings();
                        }

                    });
                text.inputEl.rows = 8;
                text.inputEl.cols = 40;
            });

        new Setting(this.containerEl)
            .setName("Update header")
            .setDesc(this.newHeaderHelp())
            .addToggle((toggle) => {
                toggle.setValue(this.plugin.settings.updateHeader);
                toggle.onChange(async (value) => {
                    this.plugin.settings.updateHeader = value;
                    await this.plugin.saveSettings();
                });
            });

    }

    private updateTemplateExample() {
        const templateLib = new Template()
        this.templateExample.innerText = templateLib.replace(this.plugin.settings.newHeaderTemplate, moment());
        let isValid = templateLib.isValidYaml(this.templateExample.innerText)
        this.templateExampleValidity.innerText = isValid ? "is valid YAML" : "is NOT valid YAML"
    }

    private newHeaderHelp(): DocumentFragment {
        const descEl = document.createDocumentFragment();
        descEl.appendText('Headers will be updated with the data defined in the template');
        descEl.appendChild(document.createElement('br'));
        descEl.appendText('useful to update the "modified date" value');
        return descEl;
    }

    private newHeaderTemplateHelp(): DocumentFragment {
        const descEl = document.createDocumentFragment();
        descEl.appendText('Newly created headers will use this template. This needs to be YAML');
        descEl.appendChild(document.createElement('br'));
        this.dateFormattingDescription(descEl);


        this.updateTemplateExample();
        descEl.appendText('Your current header ')
        descEl.appendChild(this.templateExampleValidity);
        descEl.appendText(' and the syntax looks like this:')
        descEl.appendChild(document.createElement('br'));
        descEl.appendChild(this.templateExample);
        return descEl;
    }

    private dateFormattingDescription(descEl: DocumentFragment) {
        descEl.appendText('you can use {{date}} as format, or things like {{date:YYY-MM-DD}}.');
        descEl.appendChild(document.createElement('br'));
        descEl.appendText('For more syntax, refer to ');
        this.addMomentDocsLink(descEl);
    }

    private addMomentDocsLink(descEl: DocumentFragment) {
        const a = document.createElement('a');
        a.href = 'https://momentjs.com/docs/#/displaying/format/';
        a.text = 'format reference';
        a.target = '_blank';
        descEl.appendChild(a);
        descEl.appendChild(document.createElement('br'));
    }

    templateExample = document.createElement('b');
    templateExampleValidity = document.createElement('b');

}
