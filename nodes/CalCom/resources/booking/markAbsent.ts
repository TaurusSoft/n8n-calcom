import type { INodeProperties } from 'n8n-workflow';

const showOnlyForMarkAbsent = {
	operation: ['markAbsent'],
	resource: ['booking'],
};

export const bookingMarkAbsentDescription: INodeProperties[] = [
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
			// Unwraps the fixedCollection to the flat array the API expects. When
			// no attendee was added this yields undefined and the key is dropped
			// during serialisation, so the field stays absent.
			send: {
				type: 'body',
				property: 'attendees',
				value: '={{ $value.attendee }}',
			},
		},
	},
	{
		// `host` deliberately lives in a collection rather than as a top-level
		// boolean. RoutingNode sends top-level properties unconditionally, so a
		// top-level default of false would send `host: false` on every call —
		// silently clearing an existing host no-show flag whenever someone only
		// wanted to mark an attendee absent. Collection options are sent only
		// once the user adds them, which makes both true and false explicit.
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: showOnlyForMarkAbsent },
		options: [
			{
				displayName: 'Host Was Absent',
				name: 'host',
				type: 'boolean',
				default: true,
				description:
					'Whether the host did not show up. Leave this option out to keep the current host flag unchanged.',
				routing: { send: { type: 'body', property: 'host' } },
			},
		],
	},
];
