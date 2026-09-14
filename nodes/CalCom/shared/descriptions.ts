import type { INodeProperties } from 'n8n-workflow';

/**
 * Event type picker. Resolves to the numeric event type ID in every mode, so
 * consumers can reference it as `$parameter.eventTypeId` directly.
 */
export const eventTypeLocator: INodeProperties = {
	displayName: 'Event Type',
	name: 'eventTypeId',
	type: 'resourceLocator',
	default: { mode: 'list', value: '' },
	required: true,
	description: 'The event type to book',
	modes: [
		{
			displayName: 'From List',
			name: 'list',
			type: 'list',
			typeOptions: {
				searchListMethod: 'getEventTypes',
				searchable: true,
			},
		},
		{
			displayName: 'By ID',
			name: 'id',
			type: 'string',
			validation: [
				{
					type: 'regex',
					properties: {
						regex: '^[0-9]+$',
						errorMessage: 'The event type ID must be a number',
					},
				},
			],
		},
	],
};

export const teamLocator: INodeProperties = {
	displayName: 'Team',
	name: 'teamId',
	type: 'resourceLocator',
	default: { mode: 'list', value: '' },
	required: true,
	description: 'The team that owns the event type',
	modes: [
		{
			displayName: 'From List',
			name: 'list',
			type: 'list',
			typeOptions: {
				searchListMethod: 'getTeams',
				searchable: true,
			},
		},
		{
			displayName: 'By ID',
			name: 'id',
			type: 'string',
			validation: [
				{
					type: 'regex',
					properties: {
						regex: '^[0-9]+$',
						errorMessage: 'The team ID must be a number',
					},
				},
			],
		},
	],
};

/**
 * Return All / Limit pair for cursor-paginated endpoints.
 *
 * Cal.com caps `limit` at 100 per page, so the bounded case is served by a
 * single request and only Return All walks the cursor. Pass the query
 * parameter name the endpoint expects for the page size.
 */
export function returnAllFields(
	show: Record<string, string[]>,
	limitParameter = 'limit',
): INodeProperties[] {
	return [
		{
			displayName: 'Return All',
			name: 'returnAll',
			type: 'boolean',
			default: false,
			description: 'Whether to return all results or only up to a given limit',
			displayOptions: { show },
		},
		{
			displayName: 'Limit',
			name: 'limit',
			type: 'number',
			typeOptions: { minValue: 1, maxValue: 100 },
			default: 50,
			description: 'Max number of results to return',
			displayOptions: { show: { ...show, returnAll: [false] } },
			routing: { send: { type: 'query', property: limitParameter } },
		},
	];
}
