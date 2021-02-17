import { AxiosRequestConfig } from 'axios';

export interface IJira {
	issues: IIssue[];
	total: number;
	maxResults: number;

}

export interface IIssue {
	key: string;
	fields: IFields;
}

export interface IFields {
	summary: string;
	issuetype: IIssueType;
	resolution: IResolution;
	timeoriginalestimate: number;
	timeestimate: number;
	timespent: number;
	customfield_12308: number; // Starting estimate
	customfield_12303: number; // Risk Score
}

export interface IIssueType {
	name: IssueTypeName;
}

export enum IssueTypeName {
	DEFECT = 'Defect',
	STORY = 'Story',
	TASK = 'Task',
	CHANGE_REQUEST = 'Change Request',
	TECH_SPIKE = 'Spike'
}

export enum ResolutionName {
	AWAITING_UAT = 'Awaiting UAT',
	DONE = 'Done',
	DECLINED = 'Declined',
	PASSED_UAT = 'Passed UAT'
}

export interface IResolution {
	self: string;
	id: string;
	description: string;
	name: string;
}

export interface IJiraRequest {
	url: string;
	options: AxiosRequestConfig;
}
