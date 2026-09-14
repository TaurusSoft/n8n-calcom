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
 * Personal and team event types live at different endpoints, so the dropdown
 * follows whichever scope the node is currently set to. The action node uses
 * "team", the trigger uses "teamEventType"; both mean the same thing here.
 */
function eventTypesEndpoint(this: ILoadOptionsFunctions): string {
	const scope = this.getNodeParameter('scope', 'personal') as string;

	if (scope === 'team' || scope === 'teamEventType') {
		const teamId = this.getNodeParameter('teamId', '', { extractValue: true }) as string;
		if (teamId) {
			return `/v2/teams/${encodeURIComponent(teamId)}/event-types`;
		}
	}

	return '/v2/event-types';
}

/**
 * Neither event types endpoint exposes a cursor or limit parameter, so the full
 * list comes back in one call and filtering happens client side.
 */
export async function getEventTypes(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const eventTypes = (await calComApiRequest.call(
		this,
		'GET',
		eventTypesEndpoint.call(this),
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
