import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { bookingDescription } from './resources/booking';
import { eventTypeDescription } from './resources/eventType';
import { getEventTypes } from './listSearch/getEventTypes';
import { getTeams } from './listSearch/getTeams';

export class CalCom implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cal.com',
		name: 'calCom',
		icon: { light: 'file:../../icons/calcom.svg', dark: 'file:../../icons/calcom.dark.svg' },
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Create and manage Cal.com bookings and event types',
		defaults: {
			name: 'Cal.com',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'calComApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials.host}}',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			// cal-api-version is intentionally absent: Cal.com pins each endpoint
			// group to a different version, so each operation sets its own.
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Booking',
						value: 'booking',
					},
					{
						name: 'Event Type',
						value: 'eventType',
					},
				],
				default: 'booking',
			},
			...bookingDescription,
			...eventTypeDescription,
		],
	};

	methods = {
		listSearch: {
			getEventTypes,
			getTeams,
		},
	};
}
