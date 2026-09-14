import type { INodeProperties } from 'n8n-workflow';
import { eventTypeLocator } from '../../shared/descriptions';
import { ATTENDEE_LANGUAGES } from '../../shared/constants';

const showOnlyForBookingCreate = {
	operation: ['create'],
	resource: ['booking'],
};

export const bookingCreateDescription: INodeProperties[] = [
	{
		...eventTypeLocator,
		displayOptions: { show: showOnlyForBookingCreate },
		routing: {
			send: {
				type: 'body',
				property: 'eventTypeId',
				value: '={{ Number($value) }}',
			},
		},
	},
	{
		displayName: 'Start',
		name: 'start',
		type: 'dateTime',
		default: '',
		required: true,
		displayOptions: { show: showOnlyForBookingCreate },
		description: 'When the booking starts. Sent to Cal.com as ISO 8601 in UTC.',
		routing: {
			send: {
				type: 'body',
				property: 'start',
				value: '={{ new Date($value).toISOString() }}',
			},
		},
	},
	{
		displayName: 'Attendee Name',
		name: 'attendeeName',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: showOnlyForBookingCreate },
		description: 'Name of the person being booked in',
		routing: {
			send: { type: 'body', property: 'attendee.name' },
		},
	},
	{
		displayName: 'Attendee Email',
		name: 'attendeeEmail',
		type: 'string',
		placeholder: 'name@email.com',
		default: '',
		displayOptions: { show: showOnlyForBookingCreate },
		description: 'Email of the attendee. Required unless the event type collects a phone number instead.',
		routing: {
			send: { type: 'body', property: 'attendee.email' },
		},
	},
	{
		displayName: 'Attendee Time Zone',
		name: 'attendeeTimeZone',
		type: 'string',
		default: 'Europe/Berlin',
		required: true,
		placeholder: 'Europe/Berlin',
		displayOptions: { show: showOnlyForBookingCreate },
		description: 'IANA time zone of the attendee, used to render times in confirmation emails',
		routing: {
			send: { type: 'body', property: 'attendee.timeZone' },
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: showOnlyForBookingCreate },
		options: [
			{
				displayName: 'Attendee Language',
				name: 'attendeeLanguage',
				type: 'options',
				default: 'en',
				description: 'Preferred language of the attendee, used for the booking confirmation',
				options: ATTENDEE_LANGUAGES.map((code) => ({ name: code, value: code })),
				routing: {
					send: { type: 'body', property: 'attendee.language' },
				},
			},
			{
				displayName: 'Attendee Phone Number',
				name: 'attendeePhoneNumber',
				type: 'string',
				default: '',
				placeholder: '+491701234567',
				description: 'Phone number of the attendee in international format',
				routing: {
					send: { type: 'body', property: 'attendee.phoneNumber' },
				},
			},
			{
				displayName: 'Booking Field Responses (JSON)',
				name: 'bookingFieldsResponses',
				type: 'json',
				default: '{}',
				description:
					'Answers to the event type\'s custom booking fields, keyed by field slug',
				routing: {
					send: {
						type: 'body',
						property: 'bookingFieldsResponses',
						value: '={{ JSON.parse($value) }}',
					},
				},
			},
			{
				displayName: 'Guests',
				name: 'guests',
				type: 'string',
				default: '',
				placeholder: 'guest1@email.com, guest2@email.com',
				description: 'Comma-separated email addresses to add as guests',
				routing: {
					send: {
						type: 'body',
						property: 'guests',
						value: '={{ $value.split(",").map((email) => email.trim()).filter((email) => email) }}',
					},
				},
			},
			{
				displayName: 'Length (Minutes)',
				name: 'lengthInMinutes',
				type: 'number',
				typeOptions: { minValue: 1 },
				default: 30,
				description:
					'Overrides the event type duration. Only works if the event type offers this length as an option.',
				routing: {
					send: { type: 'body', property: 'lengthInMinutes' },
				},
			},
			{
				displayName: 'Location (JSON)',
				name: 'location',
				type: 'json',
				default: '{}',
				description:
					'One of the event type\'s locations, as a location object (e.g. {"type":"attendeePhone","phone":"+491701234567"})',
				routing: {
					send: {
						type: 'body',
						property: 'location',
						value: '={{ JSON.parse($value) }}',
					},
				},
			},
			{
				displayName: 'Metadata (JSON)',
				name: 'metadata',
				type: 'json',
				default: '{}',
				description: 'Custom key-value pairs stored with the booking. Max 50 keys.',
				routing: {
					send: {
						type: 'body',
						property: 'metadata',
						value: '={{ JSON.parse($value) }}',
					},
				},
			},
		],
	},
];
