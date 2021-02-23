import ObsidianJira from "main";
import { PluginSettingTab, App, Setting } from "obsidian";

export class ObsidianJiraSettingTab extends PluginSettingTab {
	plugin: ObsidianJira;

	constructor(app: App, plugin: ObsidianJira) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let { containerEl } = this;

		containerEl.empty();
		containerEl.createEl('h2', { text: 'Configure Obsidian Jira' });

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
