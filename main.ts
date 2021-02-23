import { App, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { PluginSettings } from 'plugin-settings';
import { ObsidianJiraSettingTab } from './settings-tab';

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
			id: 'obsidian-jira-process-selection',
			name: 'Convert links in selection',
			callback: () => this.convertJiraLink()
		});

		this.addSettingTab(new ObsidianJiraSettingTab(this.app, this));
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
		const regexLink = /https:\/\/workingmouse\.atlassian\.net\/browse\/([A-Z]+-[0-9]+)/gmi; // TODO: replace with configured URL
		const regexKey = /([A-Z]+-[0-9]+)/gmi; // TODO: replace with configured URL

		const mdView = this.app.workspace.activeLeaf.view as MarkdownView;
		const doc = mdView.sourceMode.cmEditor;
		let selections = doc.getSelections();

		// TODO: Ignore if it is already part of a link
		// TODO: Handle multiple links in one line
		const mappedSelections = selections.map(selection => {
			let replacement = "";
			let isLink = false;

			if (this.settings.convertIssueLinks) {
				let match = regexLink.exec(selection);
				if (match) {
					isLink = true;
					const key = match[1];
					const transformedLink = `[${key}](${this.settings.jiraCloudUrl}/browse/${key})`;
					replacement = selection.replace(regexLink, transformedLink);
				}
			}

			if (this.settings.convertIssueKeys && !isLink) {
				let match = regexKey.exec(selection);
				console.log(match)
				if (match) {
					const key = match[1];
					const transformedLink = `[${key}](${this.settings.jiraCloudUrl}/browse/${key})`;
					replacement = selection.replace(regexKey, transformedLink);
				}
			}

			return {
				selection: selection,
				replacement: replacement
			};
		});

		mappedSelections.forEach(mappedSelection => doc.replaceSelection(mappedSelection.replacement, "start"));
	}
}

