import type { ILoadOptionsFunctions, INodeListSearchResult } from 'n8n-workflow';
import { calComApiRequest } from '../shared/transport';

interface TeamListItem {
	id: number;
	name: string;
	slug?: string;
}

/** GET /v2/teams takes no cal-api-version header. */
export async function getTeams(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const teams = (await calComApiRequest.call(
		this,
		'GET',
		'/v2/teams',
	)) as unknown as TeamListItem[];

	const results = (teams ?? [])
		.map((team) => ({ name: team.name, value: team.id }))
		.filter((option) => !filter || option.name.toLowerCase().includes(filter.toLowerCase()))
		.sort((a, b) => a.name.localeCompare(b.name));

	return { results };
}
