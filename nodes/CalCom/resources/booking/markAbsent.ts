import type { INodeProperties } from 'n8n-workflow';

const showOnlyForMarkAbsent = {
	operation: ['markAbsent'],
	resource: ['booking'],
};

/**
 * Both fields are optional per the API, but sending neither marks nobody as
 * absent, so at least one should be set for the call to do anything.
 */
export const bookingMarkAbsentDescription: INodeProperties[] = [
	{
		displayName: 'Host Was Absent',
		name: 'host',
		type: 'boolean',
		default: false,
		displayOptions: { show: showOnlyForMarkAbsent },
		description: 'Whether the host did not show up',
		routing: { send: { type: 'body', property: 'host' } },
	},
	{
		displayName: 'Absent Attendees',
		name: 'attendees',
		type: 'fixedCollection',
		typeOptions: { multipleValues: true },
		placeholder: 'Add Attendee',
		default: {},
		displayOptions: { show: showOnlyForMarkAbsent },
		description: 'Attendees to flag, identified by email',
		options: [
			{
				displayName: 'Attendee',
				name: 'attendee',
				values: [
					{
						displayName: 'Email',
						name: 'email',
						type: 'string',
						placeholder: 'name@email.com',
						default: '',
						required: true,
						description: 'Email of the attendee, as used on the booking',
					},
					{
						displayName: 'Absent',
						name: 'absent',
						type: 'boolean',
						default: true,
						description: 'Whether this attendee did not show up',
					},
				],
			},
		],
		routing: {
			send: {
				type: 'body',
				property: 'attendees',
				value: '={{ $value.attendee }}',
			},
		},
	},
];
