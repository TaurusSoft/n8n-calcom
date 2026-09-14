import type { INodeProperties } from 'n8n-workflow';

export const bookingCancelDescription: INodeProperties[] = [
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { resource: ['booking'], operation: ['cancel'] } },
		options: [
			{
				displayName: 'Cancellation Reason',
				name: 'cancellationReason',
				type: 'string',
				default: '',
				description: 'Reason shown to the attendee in the cancellation email',
				routing: { send: { type: 'body', property: 'cancellationReason' } },
			},
			{
				displayName: 'Cancel Subsequent Bookings',
				name: 'cancelSubsequentBookings',
				type: 'boolean',
				default: false,
				description:
					'Whether to also cancel all later bookings in the same recurring series',
				routing: { send: { type: 'body', property: 'cancelSubsequentBookings' } },
			},
		],
	},
];
