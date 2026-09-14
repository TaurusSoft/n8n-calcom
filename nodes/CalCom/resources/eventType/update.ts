import type { INodeProperties } from 'n8n-workflow';
import { eventTypeOptionalFields } from './create';

export const eventTypeUpdateDescription: INodeProperties[] = [
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { operation: ['update'], resource: ['eventType'] } },
		options: [
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				description: 'Name shown on the booking page',
				routing: { send: { type: 'body', property: 'title' } },
			},
			{
				displayName: 'Slug',
				name: 'slug',
				type: 'string',
				default: '',
				description: 'URL segment of the booking page',
				routing: { send: { type: 'body', property: 'slug' } },
			},
			{
				displayName: 'Length (Minutes)',
				name: 'lengthInMinutes',
				type: 'number',
				typeOptions: { minValue: 1 },
				default: 30,
				description: 'Duration of the event',
				routing: { send: { type: 'body', property: 'lengthInMinutes' } },
			},
			...eventTypeOptionalFields,
		],
	},
];
