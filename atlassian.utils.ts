import axios, { AxiosPromise } from 'axios';
import { IJiraRequest } from 'jira.interface';
import { PluginSettings } from 'plugin-settings';


const API_SEARCH = '/rest/api/2/search';

export class AtlassianUtils {
	public static getBasicAtlassianAuthString(settings: PluginSettings) {
		const buff = new Buffer(`${settings.jiraCloudUrl}:${settings.jiraToken}`);
		return `Basic ${buff.toString('base64')}`;
	}
	/**
	 *
	 *
	 * @static
	 * @param {IConfig} config
	 * @param {string} query
	 * @param {AtlassianResponseType} responseType
	 * @param {number} [itemNumber=0] The start at value
	 * @returns {string}
	 * @memberof AtlassianUtils
	 */
	public static getJQLQuery(settings: PluginSettings, query: string, itemNumber = 0) {

		const baseUrl = `${settings.jiraCloudUrl}${API_SEARCH}?`;
		const request: IJiraRequest = {
			url: baseUrl,
			options: {
				params: {
					jql: encodeURIComponent(query),
					maxResults: 100,
					startAt: itemNumber
				},
				headers: {
					Authorization: AtlassianUtils.getBasicAtlassianAuthString(settings),
				}
			}
		};

		// Compile params
		// FIXME: This should use Axios params
		request.url += `jql=${request.options.params.jql}&maxResults=`
			+ `${request.options.params.maxResults}&startAt=${request.options.params.startAt}`;
		delete request.options.params;

		return request;
	}


	// Jira has a max results limit of 100.
	public static getData(requestData: IJiraRequest): AxiosPromise {
		return axios.get(requestData.url, requestData.options);
	}
}