import type { INodeProperties } from 'n8n-workflow';

const showOnlyForBookingReschedule = {
	operation: ['reschedule'],
	resource: ['booking'],
};

export const bookingRescheduleDescription: INodeProperties[] = [
	{
		displayName: 'New Start',
		name: 'start',
		type: 'dateTime',
		default: '',
		required: true,
		displayOptions: { show: showOnlyForBookingReschedule },
		description: 'The new start time. Sent to Cal.com as ISO 8601 in UTC.',
		routing: {
			send: {
				type: 'body',
				property: 'start',
				value: '={{ new Date($value).toISOString() }}',
			},
		},
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: showOnlyForBookingReschedule },
		options: [
			{
				displayName: 'Rescheduled By',
				name: 'rescheduledBy',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
				description: 'Email of the person who triggered the reschedule',
				routing: { send: { type: 'body', property: 'rescheduledBy' } },
			},
			{
				displayName: 'Rescheduling Reason',
				name: 'reschedulingReason',
				type: 'string',
				default: '',
				description: 'Reason shown to the attendee in the reschedule email',
				routing: { send: { type: 'body', property: 'reschedulingReason' } },
			},
			{
				displayName: 'Keep Same Host',
				name: 'rescheduleWithSameHost',
				type: 'boolean',
				default: false,
				description:
					'Whether to keep the original host instead of re-running host assignment',
				routing: { send: { type: 'body', property: 'rescheduleWithSameHost' } },
			},
		],
	},
];
