import type { INodeProperties } from 'n8n-workflow';
import { CAL_API_VERSION, UNWRAP_DATA } from '../../shared/constants';
import { dropEmptyStrings } from '../../shared/preSend';
import { bookingCreateDescription } from './create';
import { bookingGetDescription } from './get';
import { bookingGetAllDescription } from './getAll';
import { bookingRescheduleDescription } from './reschedule';
import { bookingCancelDescription } from './cancel';

const showOnlyForBookings = {
	resource: ['booking'],
};

/** Every bookings endpoint is pinned to this version — except the list endpoint. */
const bookingHeaders = { 'cal-api-version': CAL_API_VERSION.bookings };

export const bookingDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForBookings },
		options: [
			{
				name: 'Cancel',
				value: 'cancel',
				action: 'Cancel a booking',
				description: 'Cancel an existing booking',
				routing: {
					request: {
						method: 'POST',
						url: '=/v2/bookings/{{$parameter.bookingUid}}/cancel',
						headers: bookingHeaders,
					},
					output: { postReceive: UNWRAP_DATA },
				},
			},
			{
				name: 'Confirm',
				value: 'confirm',
				action: 'Confirm a booking',
				description: 'Accept a booking that requires confirmation',
				routing: {
					request: {
						method: 'POST',
						url: '=/v2/bookings/{{$parameter.bookingUid}}/confirm',
						headers: bookingHeaders,
					},
					output: { postReceive: UNWRAP_DATA },
				},
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a booking',
				description: 'Book a slot on an event type',
				routing: {
					request: {
						method: 'POST',
						url: '/v2/bookings',
						headers: bookingHeaders,
					},
					// Attendee Email is optional for phone-only event types, but
					// routing would still send it as "" when left blank.
					send: { preSend: [dropEmptyStrings] },
					output: { postReceive: UNWRAP_DATA },
				},
			},
			{
				name: 'Decline',
				value: 'decline',
				action: 'Decline a booking',
				description: 'Reject a booking that requires confirmation',
				routing: {
					request: {
						method: 'POST',
						url: '=/v2/bookings/{{$parameter.bookingUid}}/decline',
						headers: bookingHeaders,
					},
					// Reason is optional and would otherwise be sent as "".
					send: { preSend: [dropEmptyStrings] },
					output: { postReceive: UNWRAP_DATA },
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a booking',
				description: 'Retrieve a single booking by its UID',
				routing: {
					request: {
						method: 'GET',
						url: '=/v2/bookings/{{$parameter.bookingUid}}',
						headers: bookingHeaders,
					},
					output: { postReceive: UNWRAP_DATA },
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many bookings',
				description: 'Retrieve a filtered list of bookings',
				routing: {
					request: {
						method: 'GET',
						url: '/v2/bookings',
						// The list endpoint is pinned to its own version, not the
						// one the rest of the bookings group uses.
						headers: { 'cal-api-version': CAL_API_VERSION.bookingsList },
					},
					send: { paginate: '={{ $parameter.returnAll }}' },
					operations: {
						pagination: {
							type: 'generic',
							properties: {
								continue: '={{ $response.body.pagination.hasMore }}',
								request: {
									qs: {
										cursor: '={{ $response.body.pagination.nextCursor }}',
										limit: 100,
									},
								},
							},
						},
					},
					output: { postReceive: UNWRAP_DATA },
				},
			},
			{
				name: 'Mark Absent',
				value: 'markAbsent',
				action: 'Mark a booking absence',
				description: 'Flag the host or an attendee as a no-show',
				routing: {
					request: {
						method: 'POST',
						url: '=/v2/bookings/{{$parameter.bookingUid}}/mark-absent',
						headers: bookingHeaders,
					},
					output: { postReceive: UNWRAP_DATA },
				},
			},
			{
				name: 'Reschedule',
				value: 'reschedule',
				action: 'Reschedule a booking',
				description: 'Move an existing booking to a new time',
				routing: {
					request: {
						method: 'POST',
						url: '=/v2/bookings/{{$parameter.bookingUid}}/reschedule',
						headers: bookingHeaders,
					},
					output: { postReceive: UNWRAP_DATA },
				},
			},
		],
		default: 'create',
	},
	...bookingCreateDescription,
	...bookingGetDescription,
	...bookingGetAllDescription,
	...bookingRescheduleDescription,
	...bookingCancelDescription,
];
