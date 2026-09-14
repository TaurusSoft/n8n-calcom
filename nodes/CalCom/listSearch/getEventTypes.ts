import type { ILoadOptionsFunctions, INodeListSearchResult } from 'n8n-workflow';
import { calComApiRequest } from '../shared/transport';
import { CAL_API_VERSION } from '../shared/constants';

interface EventTypeListItem {
	id: number;
	title: string;
	slug?: string;
	lengthInMinutes?: number;
}

/**
 * GET /v2/event-types has no cursor/limit parameters, so the full list comes
 * back in one call and filtering happens client side.
 */
export async function getEventTypes(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const eventTypes = (await calComApiRequest.call(
		this,
		'GET',
		'/v2/event-types',
		undefined,
		undefined,
		CAL_API_VERSION.eventTypes,
	)) as unknown as EventTypeListItem[];

	const results = (eventTypes ?? [])
		.map((eventType) => ({
			name: eventType.lengthInMinutes
				? `${eventType.title} (${eventType.lengthInMinutes} min)`
				: eventType.title,
			value: eventType.id,
		}))
		.filter((option) => !filter || option.name.toLowerCase().includes(filter.toLowerCase()))
		.sort((a, b) => a.name.localeCompare(b.name));

	return { results };
}
