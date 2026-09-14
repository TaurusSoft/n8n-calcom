import type { INodeProperties } from 'n8n-workflow';
import { returnAllFields } from '../../shared/descriptions';

const showOnlyForBookingGetAll = {
	operation: ['getAll'],
	resource: ['booking'],
};

export const bookingGetAllDescription: INodeProperties[] = [
	...returnAllFields(showOnlyForBookingGetAll),
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: showOnlyForBookingGetAll },
		options: [
			{
				displayName: 'Attendee Email',
				name: 'attendeeEmail',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
				description: 'Only return bookings with this attendee',
				routing: { send: { type: 'query', property: 'attendeeEmail' } },
			},
			{
				displayName: 'Attendee Name',
				name: 'attendeeName',
				type: 'string',
				default: '',
				description: 'Only return bookings with this attendee name',
				routing: { send: { type: 'query', property: 'attendeeName' } },
			},
			{
				displayName: 'Ends Before',
				name: 'beforeEnd',
				type: 'dateTime',
				default: '',
				description: 'Only return bookings ending before this moment',
				routing: {
					send: {
						type: 'query',
						property: 'beforeEnd',
						value: '={{ new Date($value).toISOString() }}',
					},
				},
			},
			{
				displayName: 'Event Type ID',
				name: 'eventTypeId',
				type: 'number',
				default: 0,
				description: 'Only return bookings for this event type',
				routing: { send: { type: 'query', property: 'eventTypeId' } },
			},
			{
				displayName: 'Sort by Start',
				name: 'sortStart',
				type: 'options',
				default: 'asc',
				description: 'Sort direction for the booking start time',
				options: [
					{ name: 'Ascending', value: 'asc' },
					{ name: 'Descending', value: 'desc' },
				],
				routing: { send: { type: 'query', property: 'sortStart' } },
			},
			{
				displayName: 'Starts After',
				name: 'afterStart',
				type: 'dateTime',
				default: '',
				description: 'Only return bookings starting after this moment',
				routing: {
					send: {
						type: 'query',
						property: 'afterStart',
						value: '={{ new Date($value).toISOString() }}',
					},
				},
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'multiOptions',
				default: [],
				description: 'Only return bookings in these states',
				options: [
					{ name: 'Cancelled', value: 'cancelled' },
					{ name: 'Past', value: 'past' },
					{ name: 'Pending', value: 'pending' },
					{ name: 'Recurring', value: 'recurring' },
					{ name: 'Upcoming', value: 'upcoming' },
				],
				routing: {
					send: { type: 'query', property: 'status', value: '={{ $value.join(",") }}' },
				},
			},
		],
	},
];
