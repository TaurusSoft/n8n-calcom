import type { INodeProperties } from 'n8n-workflow';
import { CAL_API_VERSION, UNWRAP_DATA } from '../../shared/constants';
import { teamLocator } from '../../shared/descriptions';
import { eventTypeCreateDescription } from './create';
import { eventTypeUpdateDescription } from './update';
import { eventTypeGetAllDescription } from './getAll';

const showOnlyForEventTypes = {
	resource: ['eventType'],
};

const eventTypeHeaders = { 'cal-api-version': CAL_API_VERSION.eventTypes };

/**
 * Personal event types live under /v2/event-types, team ones under
 * /v2/teams/{teamId}/event-types. Both take the same body and the same API
 * version, so one expression covers the collection path for every operation.
 */
const basePath =
	'($parameter.scope === "team" ? "/v2/teams/" + $parameter.teamId + "/event-types" : "/v2/event-types")';

const collectionUrl = `={{ ${basePath} }}`;
const itemUrl = `={{ ${basePath} + "/" + $parameter.eventTypeId }}`;

export const eventTypeDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForEventTypes },
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create an event type',
				description: 'Create a new bookable event type',
				routing: {
					request: { method: 'POST', url: collectionUrl, headers: eventTypeHeaders },
					output: { postReceive: UNWRAP_DATA },
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete an event type',
				description: 'Permanently remove an event type',
				routing: {
					request: { method: 'DELETE', url: itemUrl, headers: eventTypeHeaders },
					output: { postReceive: UNWRAP_DATA },
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get an event type',
				description: 'Retrieve a single event type by its ID',
				routing: {
					request: { method: 'GET', url: itemUrl, headers: eventTypeHeaders },
					output: { postReceive: UNWRAP_DATA },
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many event types',
				description: 'Retrieve a list of event types',
				routing: {
					request: { method: 'GET', url: collectionUrl, headers: eventTypeHeaders },
					output: {
						postReceive: [
							...UNWRAP_DATA,
							{
								type: 'limit',
								enabled: '={{ !$parameter.returnAll }}',
								properties: { maxResults: '={{ $parameter.limit }}' },
							},
						],
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update an event type',
				description: 'Change the settings of an existing event type',
				routing: {
					request: { method: 'PATCH', url: itemUrl, headers: eventTypeHeaders },
					output: { postReceive: UNWRAP_DATA },
				},
			},
		],
		default: 'create',
	},
	{
		displayName: 'Scope',
		name: 'scope',
		type: 'options',
		noDataExpression: true,
		default: 'personal',
		displayOptions: { show: showOnlyForEventTypes },
		description: 'Whether the event type belongs to you or to one of your teams',
		options: [
			{ name: 'Personal', value: 'personal' },
			{ name: 'Team', value: 'team' },
		],
	},
	{
		...teamLocator,
		displayOptions: { show: { ...showOnlyForEventTypes, scope: ['team'] } },
	},
	{
		displayName: 'Event Type ID',
		name: 'eventTypeId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: { ...showOnlyForEventTypes, operation: ['get', 'update', 'delete'] },
		},
		description: 'The numeric ID of the event type',
	},
	...eventTypeCreateDescription,
	...eventTypeUpdateDescription,
	...eventTypeGetAllDescription,
];
