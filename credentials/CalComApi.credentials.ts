import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class CalComApi implements ICredentialType {
	name = 'calComApi';

	displayName = 'Cal.com API';

	icon: Icon = { light: 'file:../icons/calcom.svg', dark: 'file:../icons/calcom.dark.svg' };

	documentationUrl = 'https://cal.com/docs/api-reference/v2/introduction';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description:
				'Create one in Cal.com under Settings → Security → API keys. Keys are prefixed with cal_ (test) or cal_live_ (live).',
		},
		{
			displayName: 'Host',
			name: 'host',
			type: 'string',
			default: 'https://api.cal.com',
			required: true,
			description: 'Base URL of the Cal.com API. Change this only for self-hosted instances.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.host}}',
			url: '/v2/me',
		},
	};
}
