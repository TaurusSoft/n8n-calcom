// Node.js builtin — the node: prefix guarantees the builtin, never the
// deprecated npm package of the same name. Not a package dependency.
import { createHmac, timingSafeEqual } from 'node:crypto';
import {
	NodeConnectionTypes,
	NodeOperationError,
	type IDataObject,
	type IHookFunctions,
	type INodeType,
	type INodeTypeDescription,
	type IWebhookFunctions,
	type IWebhookResponseData,
} from 'n8n-workflow';
import { calComApiRequest } from '../CalCom/shared/transport';
import { NO_SHOW_DEFAULTS, NO_SHOW_TRIGGERS, WEBHOOK_TRIGGERS } from '../CalCom/shared/constants';
import { getEventTypes } from '../CalCom/listSearch/getEventTypes';
import { getTeams } from '../CalCom/listSearch/getTeams';
import { eventTypeLocator, teamLocator } from '../CalCom/shared/descriptions';

interface CalComWebhook {
	id: string;
	subscriberUrl: string;
	triggers: string[];
	active: boolean;
}

/**
 * Cal.com exposes the same webhook resource at three levels. None of them takes
 * a cal-api-version header.
 */
function webhookCollectionPath(this: IHookFunctions): string {
	const scope = this.getNodeParameter('scope') as string;

	if (scope === 'eventType') {
		const eventTypeId = this.getNodeParameter('eventTypeId', undefined, {
			extractValue: true,
		}) as string;
		return `/v2/event-types/${encodeURIComponent(eventTypeId)}/webhooks`;
	}

	if (scope === 'teamEventType') {
		const teamId = this.getNodeParameter('teamId', undefined, { extractValue: true }) as string;
		const eventTypeId = this.getNodeParameter('eventTypeId', undefined, {
			extractValue: true,
		}) as string;
		return `/v2/teams/${encodeURIComponent(teamId)}/event-types/${encodeURIComponent(eventTypeId)}/webhooks`;
	}

	return '/v2/webhooks';
}

export class CalComTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cal.com V2 Trigger',
		name: 'calComTrigger',
		icon: { light: 'file:../../icons/calcom.svg', dark: 'file:../../icons/calcom.dark.svg' },
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["events"].join(", ")}}',
		description:
			'Starts a workflow on any Cal.com webhook event. Pair it with the Cal.com node to create and manage bookings and event types.',
		defaults: {
			name: 'Cal.com V2 Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'calComApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
				// The signature is computed over the exact bytes Cal.com sent, so
				// the raw body must survive parsing.
				rawBody: true,
			},
		],
		properties: [
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				required: true,
				default: [],
				description: 'The Cal.com events to subscribe to',
				options: WEBHOOK_TRIGGERS,
			},
			{
				displayName: 'Scope',
				name: 'scope',
				type: 'options',
				noDataExpression: true,
				default: 'account',
				description: 'Which Cal.com resource the webhook is attached to',
				options: [
					{
						name: 'Account',
						value: 'account',
						description: 'Fire for every event type you own',
					},
					{
						name: 'Event Type',
						value: 'eventType',
						description: 'Fire only for one of your personal event types',
					},
					{
						name: 'Team Event Type',
						value: 'teamEventType',
						description: 'Fire only for one event type belonging to a team',
					},
				],
			},
			{
				...teamLocator,
				displayOptions: { show: { scope: ['teamEventType'] } },
			},
			{
				...eventTypeLocator,
				description: 'The event type to watch',
				displayOptions: { show: { scope: ['eventType', 'teamEventType'] } },
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'No-Show Delay',
						name: 'time',
						type: 'number',
						typeOptions: { minValue: 1 },
						// Must stay in sync with NO_SHOW_DEFAULTS.time — the n8n
						// linter requires a literal here, so it cannot reference
						// the constant directly.
						default: 5,
						description:
							'How long after the booking start the no-show triggers are evaluated. Only used by the two no-show events, which fall back to this default if you do not set it.',
					},
					{
						displayName: 'No-Show Delay Unit',
						name: 'timeUnit',
						type: 'options',
						// Must stay in sync with NO_SHOW_DEFAULTS.timeUnit.
						default: 'MINUTE',
						description: 'Unit for the no-show delay',
						options: [
							{ name: 'Days', value: 'DAY' },
							{ name: 'Hours', value: 'HOUR' },
							{ name: 'Minutes', value: 'MINUTE' },
						],
					},
					{
						displayName: 'Payload Template',
						name: 'payloadTemplate',
						type: 'string',
						typeOptions: { rows: 4 },
						default: '',
						description:
							'Custom payload template. Leave empty to receive the default Cal.com payload.',
					},
					{
						displayName: 'Payload Version',
						name: 'version',
						type: 'options',
						default: '2021-10-20',
						description: 'Which payload format Cal.com should send',
						options: [
							{ name: '2021-10-20 (Default)', value: '2021-10-20' },
							{
								name: '2026-07-27 (Adds ICS Content)',
								value: '2026-07-27',
							},
						],
					},
					{
						displayName: 'Secret',
						name: 'secret',
						type: 'string',
						typeOptions: { password: true },
						default: '',
						description:
							'Shared secret. When set, every incoming request is verified against its x-cal-signature-256 header and rejected if it does not match.',
					},
				],
			},
		],
	};

	methods = {
		listSearch: {
			getEventTypes,
			getTeams,
		},
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const webhookUrl = this.getNodeWebhookUrl('default');
				const endpoint = webhookCollectionPath.call(this);

				const webhooks = (await calComApiRequest.call(
					this,
					'GET',
					endpoint,
				)) as unknown as CalComWebhook[];

				const existing = (webhooks ?? []).find(
					(webhook) => webhook.subscriberUrl === webhookUrl,
				);

				if (existing === undefined) {
					return false;
				}

				webhookData.webhookId = existing.id;
				return true;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const webhookUrl = this.getNodeWebhookUrl('default');
				const events = this.getNodeParameter('events') as string[];
				const options = this.getNodeParameter('options', {}) as IDataObject;

				if (events.length === 0) {
					throw new NodeOperationError(
						this.getNode(),
						'Select at least one event for the trigger to subscribe to',
					);
				}

				const body: IDataObject = {
					active: true,
					subscriberUrl: webhookUrl,
					triggers: events,
				};

				if (options.secret) {
					body.secret = options.secret;
				}

				if (options.version) {
					body.version = options.version;
				}

				if (options.payloadTemplate) {
					body.payloadTemplate = options.payloadTemplate;
				}

				// Cal.com rejects a no-show subscription that arrives without both
				// values. An n8n collection only yields the options the user
				// actually added, so fall back to the same defaults the fields
				// advertise rather than failing on an untouched Options section.
				const subscribesToNoShow = events.some((event) => NO_SHOW_TRIGGERS.includes(event));
				if (subscribesToNoShow) {
					body.time = options.time ?? NO_SHOW_DEFAULTS.time;
					body.timeUnit = options.timeUnit ?? NO_SHOW_DEFAULTS.timeUnit;
				}

				const endpoint = webhookCollectionPath.call(this);
				const created = (await calComApiRequest.call(
					this,
					'POST',
					endpoint,
					body,
				)) as unknown as CalComWebhook;

				if (created?.id === undefined) {
					return false;
				}

				webhookData.webhookId = created.id;

				// The secret is deliberately not cached here: webhook() reads it
				// from the credential-backed node parameter, so copying it into
				// workflow static data would only duplicate it unprotected.
				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				if (webhookData.webhookId === undefined) {
					return true;
				}

				const endpoint = webhookCollectionPath.call(this);

				try {
					await calComApiRequest.call(
						this,
						'DELETE',
						`${endpoint}/${webhookData.webhookId as string}`,
					);
				} catch (error) {
					// Leave webhookId in place: the webhook may still exist in
					// Cal.com, and keeping the ID lets a later deactivation retry
					// instead of orphaning it.
					this.logger.error('Cal.com: failed to delete webhook on deactivation', {
						webhookId: webhookData.webhookId,
						error: (error as Error).message,
					});
					return false;
				}

				delete webhookData.webhookId;

				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const options = this.getNodeParameter('options', {}) as IDataObject;
		const secret = (options.secret as string) || '';
		const bodyData = this.getBodyData();

		if (secret) {
			const request = this.getRequestObject();
			const headers = this.getHeaderData() as IDataObject;
			const received = (headers['x-cal-signature-256'] as string) ?? '';

			// rawBody is requested in the webhook description; fall back to a
			// re-serialised body only if it is unavailable.
			const rawBody: Buffer | string =
				(request as unknown as { rawBody?: Buffer }).rawBody ?? JSON.stringify(bodyData);

			const expected = createHmac('sha256', secret)
				.update(Buffer.isBuffer(rawBody) ? rawBody : Buffer.from(rawBody, 'utf8'))
				.digest('hex');

			const receivedBuffer = Buffer.from(received, 'utf8');
			const expectedBuffer = Buffer.from(expected, 'utf8');

			const valid =
				receivedBuffer.length === expectedBuffer.length &&
				timingSafeEqual(receivedBuffer, expectedBuffer);

			if (!valid) {
				// Drop the request without starting the workflow.
				return { noWebhookResponse: true };
			}
		}

		return {
			workflowData: [this.helpers.returnJsonArray(bodyData as IDataObject)],
		};
	}
}
