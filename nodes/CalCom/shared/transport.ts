import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
	IWebhookFunctions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

type CalComRequestContext =
	| IExecuteFunctions
	| IHookFunctions
	| ILoadOptionsFunctions
	| IWebhookFunctions;

interface CalComEnvelope<T> {
	status: 'success' | 'error';
	data: T;
	error?: IDataObject;
}

/**
 * Programmatic counterpart to the declarative routing used by the action node.
 * Needed wherever routing cannot reach: the listSearch dropdowns and the
 * trigger's webhook lifecycle hooks.
 *
 * Pass `apiVersion` only for endpoint groups that define one — see
 * CAL_API_VERSION. Webhook and team endpoints must be called without it.
 */
export async function calComApiRequest<T = IDataObject>(
	this: CalComRequestContext,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject,
	qs?: IDataObject,
	apiVersion?: string,
): Promise<T> {
	const credentials = await this.getCredentials('calComApi');

	const options: IHttpRequestOptions = {
		method,
		baseURL: credentials.host as string,
		url: endpoint,
		json: true,
		headers: {
			Accept: 'application/json',
			...(apiVersion ? { 'cal-api-version': apiVersion } : {}),
		},
	};

	if (body !== undefined && Object.keys(body).length > 0) {
		options.body = body;
	}

	if (qs !== undefined && Object.keys(qs).length > 0) {
		options.qs = qs;
	}

	try {
		const response = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'calComApi',
			options,
		);

		// Every v2 response is wrapped in { status, data }. Unwrap it so callers
		// see the payload, matching what the declarative operations return.
		const envelope = response as CalComEnvelope<T>;
		if (envelope !== null && typeof envelope === 'object' && 'data' in envelope) {
			return envelope.data;
		}

		return response as T;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}
