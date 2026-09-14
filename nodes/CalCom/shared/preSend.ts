import type { IDataObject, IExecuteSingleFunctions, IHttpRequestOptions } from 'n8n-workflow';

/**
 * n8n's declarative routing sends every top-level property unconditionally —
 * there is no empty-value guard in RoutingNode — so an optional field the user
 * left blank still reaches the API as "". Cal.com validates `attendee.email` as
 * an email address and rejects the empty string with a 400.
 *
 * Fields inside a `collection` are unaffected (RoutingNode skips options the
 * user never added), so this only has to cover top-level optional fields.
 *
 * Applied to create-style operations only: on an update an empty string is a
 * meaningful instruction to clear the field, and must survive.
 */
export async function dropEmptyStrings(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const prune = (target: IDataObject): void => {
		for (const [key, value] of Object.entries(target)) {
			if (value === '' || value === undefined || value === null) {
				delete target[key];
			} else if (typeof value === 'object' && !Array.isArray(value)) {
				prune(value as IDataObject);
			}
		}
	};

	if (requestOptions.body !== undefined && typeof requestOptions.body === 'object') {
		prune(requestOptions.body as IDataObject);
	}

	// An emptied body is deliberately kept as {} rather than removed. Every
	// booking endpoint this runs on declares `requestBody: required: true` with
	// only optional fields (decline takes just `reason`), so the body must be
	// present even when it carries nothing. Deleting it would turn a valid
	// request into a missing-body 400.
	return requestOptions;
}
