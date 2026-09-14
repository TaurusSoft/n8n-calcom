import type { INodeProperties } from 'n8n-workflow';

export const bookingGetDescription: INodeProperties[] = [
	{
		displayName: 'Booking UID',
		name: 'bookingUid',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['booking'],
				operation: ['get', 'reschedule', 'cancel', 'confirm', 'decline', 'markAbsent'],
			},
		},
		description: 'The UID of the booking, as returned by Create or Get Many',
	},
];
