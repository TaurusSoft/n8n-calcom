import type { IDataObject, IExecuteSingleFunctions, IHttpRequestOptions } from 'n8n-workflow';

/**
 * Removes blank values from a request body before it is sent.
 *
 * n8n's declarative routing has no empty-value guard: RoutingNode calls
 * `set(body, property, value)` unconditionally, so a node field the user left
 * blank still reaches the API as "". Cal.com validates `attendee.email` as an
 * email address and rejects the empty string with a 400.
 *
 * The walk is recursive by necessity, not for completeness. Routing writes with
 * dot notation, so a single node field can land at a nested body path —
 * `attendeeEmail` becomes `body.attendee.email`, which is exactly the case this
 * exists for. Pruning only the body's top level would miss it.
 *
 * What it does NOT need to reach: fields inside a `collection`. RoutingNode
 * skips options the user never added, so those never produce blank values.
 *
 * `undefined` and `null` are dropped alongside "" because all three mean "no
 * value given" here; `0`, `false` and `[]` are meaningful and are kept.
 *
 * Wired to create-style operations only. On an update an empty string is a
 * deliberate instruction to clear a field and must survive.
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
