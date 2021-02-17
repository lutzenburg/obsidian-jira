import { App, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { PluginSettings } from 'plugin-settings';

const DEFAULT_SETTINGS: PluginSettings = {
	jiraCloudUrl: 'atlassian.net',
	convertIssueKeys: true,
	convertIssueLinks: true,
	jiraToken: ''
}

export default class ObsidianJira extends Plugin {
	settings: PluginSettings;

	async onload() {
		await this.loadSettings();


		// this.addRibbonIcon('dice', 'Sample Plugin', () => {
		// 	new Notice('This is a notice!');
		// });

		// this.addStatusBarItem().setText('Status Bar Text');

		this.addCommand({
			id: 'obsidian-jira-process-file',
			name: 'Process selection',
			callback: () => this.convertJiraLink()
		});

		this.addSettingTab(new SettingTab(this.app, this));
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {
		console.log('unloading plugin');
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async convertJiraLink(): Promise<void> {
		const mdView = this.app.workspace.activeLeaf.view as MarkdownView;
		const doc = mdView.sourceMode.cmEditor;
		let selection = doc.getSelection();
		debugger;
		console.log(selection);
	}
}


class SettingTab extends PluginSettingTab {
	plugin: ObsidianJira;

	constructor(app: App, plugin: ObsidianJira) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let {containerEl} = this;

		containerEl.empty();
		containerEl.createEl('h2', {text: 'Configure Obsidian Jira'});

		new Setting(containerEl)
			.setName('Base URL')
			.setDesc('The base URL of your Jira site.')
			.addText(text => text
				.setPlaceholder('Enter the base URL of your site')
				.setValue(this.plugin.settings.jiraCloudUrl)
				.onChange(async (value) => {
					this.plugin.settings.jiraCloudUrl = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('API token')
			.setDesc('Your Atlassian API token. You can create one via https://id.atlassian.com/manage/api-tokens')
			.addText(text => text
				.setPlaceholder('Enter the base URL of your site')
				.setValue(this.plugin.settings.jiraToken)
				.onChange(async (value) => {
					this.plugin.settings.jiraToken = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Convert issue keys')
			.setDesc('Convert issue keys into markdown links with the key as the text')
			.addToggle(toggle => {
				toggle
					.setValue(this.plugin.settings.convertIssueKeys)
					.onChange(async (value) => {
						this.plugin.settings.convertIssueKeys = value;
						await this.plugin.saveSettings();
					})
			})

		new Setting(containerEl)
			.setName('Convert issue links')
			.setDesc('Convert issue keys into markdown links with the key as the text')
			.addToggle(toggle => {
				toggle
					.setValue(this.plugin.settings.convertIssueLinks)
					.onChange(async (value) => {
						this.plugin.settings.convertIssueLinks = value;
						await this.plugin.saveSettings();
					})
			})
	}
}
