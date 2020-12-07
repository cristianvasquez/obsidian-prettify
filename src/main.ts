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

            // Remember the cursor
            const cursor = editor.getCursor()

            editor.execCommand('selectAll')
            let text = editor.getSelection()

            prettifier(text, this.settings
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
    updateHeader = true;
    newHeaderTemplate = NEW_HEADER_TEMPLATE
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

        /**
         * I don't know yet how to tame this frontend animal.
         * @TODO findout what's the name of this framework.
         */
        containerEl.findAll('div')
            .forEach((leaf) => leaf.detach());
        containerEl.findAll('h3')
            .forEach((leaf) => leaf.detach());

        this.containerEl.createEl("h3", {
            text: "Prettyfication Settings",
        });

        // ('*', '+', or '-', default: '*'). Marker to use to for bullets of items in unordered lists
        new Setting(containerEl)
            .setName("bullet")
            .setDesc("Marker to use to for bullets of items in unordered lists")
            .addDropdown((dropdown) => {
                    dropdown.setValue(this.plugin.settings.bullet);
                    dropdown.addOption("*", "* item");
                    dropdown.addOption("+", "+ item");
                    dropdown.addOption("-", "- item");
                    dropdown.setValue(String(settings.bullet)).onChange((value) => {
                        settings.bullet = value;
                        this.plugin.saveData(settings);
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
                    dropdown.setValue(String(settings.emphasis)).onChange((value) => {
                        settings.emphasis = value;
                        this.plugin.saveData(settings);
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
                    dropdown.setValue(String(settings.rule)).onChange((value) => {
                        settings.rule = value;
                        this.plugin.saveData(settings);
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
                    settings.createHeaderIfNotPresent = value;
                    this.plugin.saveData(settings);
                });
            });

        new Setting(containerEl)
            .setName('Header template')
            .setDesc(this.newHeaderTemplateHelp())
            .addTextArea((text) => {
                text
                    // .setPlaceholder("Example: {{date:YYYYMMDDHHmm}}-")
                    .setValue(this.plugin.settings.newHeaderTemplate || '')
                    .onChange((value) => {
                        this.plugin.settings.newHeaderTemplate = value;
                        this.updateTemplateExample();

                        if (new Template().isValidYaml(this.plugin.settings.newHeaderTemplate)) {
                            this.plugin.saveData(this.plugin.settings);
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
                    settings.updateHeader = value;
                    this.plugin.saveData(settings);
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
