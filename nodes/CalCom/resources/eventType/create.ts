import type { INodeProperties } from 'n8n-workflow';

const showOnlyForEventTypeCreate = {
	operation: ['create'],
	resource: ['eventType'],
};

/**
 * Optional event type settings, shared by Create (as "Additional Fields") and
 * Update (as "Update Fields"). `bookingFields` is deliberately left out: Cal.com
 * rejects an array that is empty, holds duplicates, or hides every contact
 * field, so the safe default is to let Cal.com apply its own.
 */
export const eventTypeOptionalFields: INodeProperties[] = [
	{
		displayName: 'After Event Buffer (Minutes)',
		name: 'afterEventBuffer',
		type: 'number',
		typeOptions: { minValue: 0 },
		default: 0,
		description: 'Blocked time after each booking',
		routing: { send: { type: 'body', property: 'afterEventBuffer' } },
	},
	{
		displayName: 'Before Event Buffer (Minutes)',
		name: 'beforeEventBuffer',
		type: 'number',
		typeOptions: { minValue: 0 },
		default: 0,
		description: 'Blocked time before each booking',
		routing: { send: { type: 'body', property: 'beforeEventBuffer' } },
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		typeOptions: { rows: 3 },
		default: '',
		description: 'Text shown on the booking page',
		routing: { send: { type: 'body', property: 'description' } },
	},
	{
		displayName: 'Disable Cancelling',
		name: 'disableCancelling',
		type: 'boolean',
		default: false,
		description: 'Whether to prevent attendees from cancelling their booking',
		routing: { send: { type: 'body', property: 'disableCancelling' } },
	},
	{
		displayName: 'Disable Rescheduling',
		name: 'disableRescheduling',
		type: 'boolean',
		default: false,
		description: 'Whether to prevent attendees from rescheduling their booking',
		routing: { send: { type: 'body', property: 'disableRescheduling' } },
	},
	{
		displayName: 'Hidden',
		name: 'hidden',
		type: 'boolean',
		default: false,
		description: 'Whether to hide the event type from your public booking page',
		routing: { send: { type: 'body', property: 'hidden' } },
	},
	{
		displayName: 'Locations (JSON)',
		name: 'locations',
		type: 'json',
		default: '[]',
		description:
			'Array of location objects, e.g. [{"type":"integration","integration":"cal-video"}]. Defaults to a Cal Video link. Conferencing apps must already be installed.',
		routing: {
			send: { type: 'body', property: 'locations', value: '={{ JSON.parse($value) }}' },
		},
	},
	{
		displayName: 'Minimum Booking Notice (Minutes)',
		name: 'minimumBookingNotice',
		type: 'number',
		typeOptions: { minValue: 0 },
		default: 120,
		description: 'How far in advance a booking must be made',
		routing: { send: { type: 'body', property: 'minimumBookingNotice' } },
	},
	{
		displayName: 'Schedule ID',
		name: 'scheduleId',
		type: 'number',
		default: 0,
		description: 'Availability schedule to use. Falls back to your default schedule.',
		routing: { send: { type: 'body', property: 'scheduleId' } },
	},
	{
		displayName: 'Seats (JSON)',
		name: 'seats',
		type: 'json',
		default: '{}',
		description:
			'Seated event configuration, e.g. {"seatsPerTimeSlot":5,"showAttendeeInfo":false}',
		routing: {
			send: { type: 'body', property: 'seats', value: '={{ JSON.parse($value) }}' },
		},
	},
	{
		displayName: 'Slot Interval (Minutes)',
		name: 'slotInterval',
		type: 'number',
		typeOptions: { minValue: 1 },
		default: 15,
		description: 'Spacing between offered slots. Defaults to the event length.',
		routing: { send: { type: 'body', property: 'slotInterval' } },
	},
	{
		displayName: 'Success Redirect URL',
		name: 'successRedirectUrl',
		type: 'string',
		default: '',
		placeholder: 'https://example.com/thanks',
		description: 'Where to send the attendee after booking',
		routing: { send: { type: 'body', property: 'successRedirectUrl' } },
	},
];

export const eventTypeCreateDescription: INodeProperties[] = [
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'Discovery Call',
		displayOptions: { show: showOnlyForEventTypeCreate },
		description: 'Name shown on the booking page',
		routing: { send: { type: 'body', property: 'title' } },
	},
	{
		displayName: 'Slug',
		name: 'slug',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'discovery-call',
		displayOptions: { show: showOnlyForEventTypeCreate },
		description: 'URL segment of the booking page, e.g. cal.com/your-name/discovery-call',
		routing: { send: { type: 'body', property: 'slug' } },
	},
	{
		displayName: 'Length (Minutes)',
		name: 'lengthInMinutes',
		type: 'number',
		typeOptions: { minValue: 1 },
		default: 30,
		required: true,
		displayOptions: { show: showOnlyForEventTypeCreate },
		description: 'Duration of the event',
		routing: { send: { type: 'body', property: 'lengthInMinutes' } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: showOnlyForEventTypeCreate },
		options: eventTypeOptionalFields,
	},
];
