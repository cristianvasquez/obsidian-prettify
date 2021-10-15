import {App, MarkdownView, Notice, Plugin, PluginSettingTab, Setting} from "obsidian";

import Template from './templates'
import moment from 'moment'

import type {MarkdownPrettifierOptions} from "./domain";
import prettifier from "./prettifier"
import {NEW_HEADER_TEMPLATE, UPDATE_HEADER_TEMPLATE} from "./constants";

const DEFAULT_SETTINGS: MarkdownPrettifierOptions = {
    bullet: "-", // ('*', '+', or '-', default: '*'). Marker to use to for bullets of items in unordered lists
    emphasis: "_", // ('*' or '_', default: '*'). Marker to use to serialize emphasis
    rule: "-", // ('*', '-', or '_', default: '*'). Marker to use for thematic breaks
    createHeaderIfNotPresent: true,
    newHeaderTemplate: NEW_HEADER_TEMPLATE,
    updateHeader: true,
    updateHeaderTemplate: UPDATE_HEADER_TEMPLATE,
    listItemIndent: "one",
    newlinesAroundHeadings: true,
};

export default class MarkdownPrettifier extends Plugin {
    // This field stores your plugin settings.
    settings: MarkdownPrettifierOptions;

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
            name: "Run with Hashtag janitor",
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
            const editor = view.editor;


            // Remember the cursor
            const cursor = Object.assign({}, editor.getCursor());
            let text = editor.getDoc().getValue()

            prettifier(text, this.settings, {today: moment(), tags: []})
                .then((data) => {
                    let output = String(data);

                    try {
                        // Calculate difference of lines and provide feedback
                        const n_before = output.split(/\r\n|\r|\n/).length;
                        const n_after = String(text).split(/\r\n|\r|\n/).length;
                        const lines_changed = n_before - n_after;
                        if (lines_changed != 0) {
                            new Notice(`Prettifier:  ${lines_changed} lines.`);
                        }
                        // Update the cursor
                        if (cursor.line) {
                            cursor.line = cursor.line + lines_changed;
                        }
                    } catch (err) {
                        console.error(err);
                    }
                    editor.setValue(output)
                    editor.setCursor(cursor);
                }).catch((err) => {
                console.error(err);
                if (err.message) {
                    new Notice(err.message);
                }
            });
        }
    }

    updateMatters() {
        const view = this.app.workspace.activeLeaf.view;
        if (view instanceof MarkdownView) {
            // Do work here
            const editor = view.editor;

            // Remember the cursor
            const cursor = editor.getCursor();
            let text = editor.getDoc().getValue()

            let frontMatterData = {
                today: moment(),
                tags: new Template().findHashtags(text),
            };

            prettifier(text, this.settings, frontMatterData)
                .then((data) => {
                    editor.setValue(String(data))
                    editor.setCursor(cursor);
                    new Notice("Updated tags");
                })
                .catch((err) => {
                    console.error(err);
                    if (err.message) {
                        new Notice(err.message);
                    }
                });
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
                            this.plugin.settings.bullet = value as '*' | '+' | '-';
                            await this.plugin.saveSettings();
                        })
                }
            );

        new Setting(containerEl)
            .setName("List indent")
            .setDesc("Whether to use small or big spaces to indent lists")
            .addDropdown((dropdown) => {
                    dropdown.addOption('one', "small");
                    // dropdown.addOption('mixed', "mixed");
                    dropdown.addOption('tab', "big");
                    dropdown.setValue(String(this.plugin.settings.listItemIndent))
                        .onChange(async (value) => {
                            this.plugin.settings.listItemIndent = value as
                                | "one"
                                // | "mixed"
                                | "tab";
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
                        this.plugin.settings.emphasis = value as
                            | "*"
                            | "_";
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
                        this.plugin.settings.rule = value as "*" | "-" | "_";
                        await this.plugin.saveSettings();
                    })
                }
            );

        new Setting(containerEl)
            .setName('Newlines around headings')
            .setDesc('Add empty lines around each heading')
            .addToggle((toggle) => {
                toggle.setValue(this.plugin.settings.newlinesAroundHeadings);
                toggle.onChange(async (value) => {
                    this.plugin.settings.newlinesAroundHeadings = value;
                    await this.plugin.saveSettings();
                });
            });

        this.containerEl.createEl("h3", {
            text: "Add new Header Settings",
        });

        new Setting(this.containerEl)
            .setName("Add a new header")
            .setDesc("Adds a new header if there isn't")
            .addToggle((toggle) => {
                toggle.setValue(this.plugin.settings.createHeaderIfNotPresent);
                toggle.onChange(async (value) => {
                    this.plugin.settings.createHeaderIfNotPresent = value;
                    await this.plugin.saveSettings();
                });
            });

        new Setting(containerEl)
            .setName('New Header template')
            .setDesc(this.checkNewTemplate())
            .addTextArea((text) => {
                text
                    .setValue(this.plugin.settings.newHeaderTemplate || '')
                    .onChange(async (value) => {
                        this.plugin.settings.newHeaderTemplate = value;
                        let example = this.applyTemplate(this.plugin.settings.newHeaderTemplate)
                        this.newHeaderExample.innerText = example.text
                        this.newHeaderIsValid.innerText = example.valid ? "is valid YAML" : "is NOT valid YAML"
                        if (example.valid) {
                            await this.plugin.saveSettings();
                        }
                    });
                text.inputEl.rows = 8;
                text.inputEl.cols = 40;
            });

        this.containerEl.createEl("h3", {
            text: "Update Header Settings",
        });

        new Setting(this.containerEl)
            .setName("Update header")
            .setDesc(this.updateTemplateHelp())
            .addToggle((toggle) => {
                toggle.setValue(this.plugin.settings.updateHeader);
                toggle.onChange(async (value) => {
                    this.plugin.settings.updateHeader = value;
                    await this.plugin.saveSettings();
                });
            });

        new Setting(containerEl)
            .setName('Update Header template')
            .setDesc(this.checkUpdateTemplate())
            .addTextArea((text) => {
                text
                    .setValue(this.plugin.settings.updateHeaderTemplate || '')
                    .onChange(async (value) => {
                        this.plugin.settings.updateHeaderTemplate = value;
                        let example = this.applyTemplate(this.plugin.settings.updateHeaderTemplate)
                        this.updateHeaderExample.innerText = example.text
                        this.updateHeaderIsValid.innerText = example.valid ? "is valid YAML" : "is NOT valid YAML"
                        if (example.valid) {
                            await this.plugin.saveSettings();
                        }

                    });
                text.inputEl.rows = 8;
                text.inputEl.cols = 40;
            });

    }

    private updateTemplateHelp(): DocumentFragment {
        const descEl = document.createDocumentFragment();
        descEl.appendText('If there is a header, they will be updated with the data defined in the template');
        descEl.appendChild(document.createElement('br'));
        descEl.appendText('useful to update the "modified date" value');
        return descEl;
    }

    newHeaderExample = document.createElement('b');
    newHeaderIsValid = document.createElement('b');

    private checkNewTemplate(): DocumentFragment {
        const descEl = document.createDocumentFragment();
        descEl.appendText('Newly created headers will use this template. This needs to be YAML');
        descEl.appendChild(document.createElement('br'));
        this.formattingDescription(descEl);

        let example = this.applyTemplate(this.plugin.settings.newHeaderTemplate)
        this.newHeaderExample.innerText = example.text
        this.newHeaderIsValid.innerText = example.valid ? "is valid YAML" : "is NOT valid YAML"

        descEl.appendText('Your current header ')
        descEl.appendChild(this.newHeaderIsValid);
        descEl.appendText(' and the syntax looks like this:')
        descEl.appendChild(document.createElement('br'));
        descEl.appendChild(this.newHeaderExample);
        return descEl;
    }

    updateHeaderExample = document.createElement('b');
    updateHeaderIsValid = document.createElement('b');

    private checkUpdateTemplate(): DocumentFragment {
        const descEl = document.createDocumentFragment();
        let example = this.applyTemplate(this.plugin.settings.updateHeaderTemplate)
        this.updateHeaderExample.innerText = example.text
        this.updateHeaderIsValid.innerText = example.valid ? "is valid YAML" : "is NOT valid YAML"
        descEl.appendText('Your current header ')
        descEl.appendChild(this.updateHeaderIsValid);
        descEl.appendText(' and the syntax looks like this:')
        descEl.appendChild(document.createElement('br'));
        descEl.appendChild(this.updateHeaderExample);
        return descEl;
    }

    private applyTemplate(template:string){
        let templateLib = new Template()
        let text = templateLib.replaceUUID(template)
        text = templateLib.replaceDates(text, moment())
        return {
            text:text,
            valid:templateLib.isValidYaml(text)
        }
    }

    private formattingDescription(descEl: DocumentFragment) {
        descEl.appendText('you can use {{UUID}} to generate unique IDs, {{date}} for dates, or things like {{date:YYY-MM-DD}}.');
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
}
