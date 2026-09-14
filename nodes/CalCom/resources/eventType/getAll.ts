import type { INodeProperties } from 'n8n-workflow';

const showOnlyForEventTypeGetAll = {
	operation: ['getAll'],
	resource: ['eventType'],
};

/**
 * GET /v2/event-types exposes no cursor or limit parameter — the whole list
 * comes back at once. The limit is therefore applied client side via
 * postReceive, so it cannot be silently ignored.
 */
export const eventTypeGetAllDescription: INodeProperties[] = [
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: { show: showOnlyForEventTypeGetAll },
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1 },
		default: 50,
		description: 'Max number of results to return',
		displayOptions: { show: { ...showOnlyForEventTypeGetAll, returnAll: [false] } },
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: showOnlyForEventTypeGetAll },
		options: [
			{
				displayName: 'Event Slug',
				name: 'eventSlug',
				type: 'string',
				default: '',
				description: 'Only return the event type with this slug',
				routing: { send: { type: 'query', property: 'eventSlug' } },
			},
			{
				displayName: 'Sort by Created Date',
				name: 'sortCreatedAt',
				type: 'options',
				default: 'asc',
				description: 'Sort direction for the creation date',
				options: [
					{ name: 'Ascending', value: 'asc' },
					{ name: 'Descending', value: 'desc' },
				],
				routing: { send: { type: 'query', property: 'sortCreatedAt' } },
			},
			{
				displayName: 'Username',
				name: 'username',
				type: 'string',
				default: '',
				description: 'Only return event types belonging to this Cal.com username',
				routing: { send: { type: 'query', property: 'username' } },
			},
		],
	},
];
