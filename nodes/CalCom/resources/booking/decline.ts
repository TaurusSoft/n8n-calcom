import type { INodeProperties } from 'n8n-workflow';

export const bookingDeclineDescription: INodeProperties[] = [
	{
		displayName: 'Reason',
		name: 'reason',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['booking'], operation: ['decline'] } },
		description: 'Reason for declining the booking request',
		routing: { send: { type: 'body', property: 'reason' } },
	},
];
