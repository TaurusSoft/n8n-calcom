import type { INodePropertyOptions } from 'n8n-workflow';

/**
 * Cal.com pins each endpoint group to its own API version, and the header is
 * mandatory where it applies — sending the wrong value silently falls back to
 * an older response shape. It therefore cannot live in the node's
 * requestDefaults; every operation sets the value belonging to its group.
 *
 * Webhook and team endpoints take no version header at all.
 */
export const CAL_API_VERSION = {
	bookings: '2026-02-25',
	bookingsList: '2026-05-01',
	eventTypes: '2026-06-12',
} as const;

/** Unwraps the `{ status, data }` envelope every Cal.com v2 response is wrapped in. */
export const UNWRAP_DATA = [
	{
		type: 'rootProperty' as const,
		properties: { property: 'data' },
	},
];

/** The no-show triggers require `time` + `timeUnit` to be sent alongside them. */
export const NO_SHOW_TRIGGERS = [
	'AFTER_HOSTS_CAL_VIDEO_NO_SHOW',
	'AFTER_GUESTS_CAL_VIDEO_NO_SHOW',
];

export const WEBHOOK_TRIGGERS: INodePropertyOptions[] = [
	{ name: 'Booking Cancelled', value: 'BOOKING_CANCELLED' },
	{ name: 'Booking Created', value: 'BOOKING_CREATED' },
	{ name: 'Booking Location Updated', value: 'BOOKING_LOCATION_UPDATED' },
	{ name: 'Booking No-Show Updated', value: 'BOOKING_NO_SHOW_UPDATED' },
	{ name: 'Booking Paid', value: 'BOOKING_PAID' },
	{ name: 'Booking Payment Initiated', value: 'BOOKING_PAYMENT_INITIATED' },
	{ name: 'Booking Reassigned', value: 'BOOKING_REASSIGNED' },
	{ name: 'Booking Rejected', value: 'BOOKING_REJECTED' },
	{ name: 'Booking Requested', value: 'BOOKING_REQUESTED' },
	{ name: 'Booking Rescheduled', value: 'BOOKING_RESCHEDULED' },
	{ name: 'Calendar Entry Rejected', value: 'CALENDAR_ENTRY_REJECTED' },
	{ name: 'Delegation Credential Error', value: 'DELEGATION_CREDENTIAL_ERROR' },
	{ name: 'Delegation Credential Rotation Required', value: 'DELEGATION_CREDENTIAL_ROTATION_REQUIRED' },
	{ name: 'Delegation Credential Secret Rotated', value: 'DELEGATION_CREDENTIAL_SECRET_ROTATED' },
	{
		name: 'Delegation Credential Secret Rotation Failed',
		value: 'DELEGATION_CREDENTIAL_SECRET_ROTATION_FAILED',
	},
	{ name: 'Form Submitted', value: 'FORM_SUBMITTED' },
	{ name: 'Form Submitted Without Event', value: 'FORM_SUBMITTED_NO_EVENT' },
	{ name: 'Guests Did Not Show Up (After Delay)', value: 'AFTER_GUESTS_CAL_VIDEO_NO_SHOW' },
	{ name: 'Hosts Did Not Show Up (After Delay)', value: 'AFTER_HOSTS_CAL_VIDEO_NO_SHOW' },
	{ name: 'Instant Meeting', value: 'INSTANT_MEETING' },
	{ name: 'Instant Meeting Accepted', value: 'INSTANT_MEETING_ACCEPTED' },
	{ name: 'Meeting Ended', value: 'MEETING_ENDED' },
	{ name: 'Meeting Started', value: 'MEETING_STARTED' },
	{ name: 'Out of Office Created', value: 'OOO_CREATED' },
	{ name: 'Recording Ready', value: 'RECORDING_READY' },
	{ name: 'Recording Transcription Generated', value: 'RECORDING_TRANSCRIPTION_GENERATED' },
	{ name: 'Routing Form Fallback Hit', value: 'ROUTING_FORM_FALLBACK_HIT' },
	{ name: 'Wrong Assignment Report', value: 'WRONG_ASSIGNMENT_REPORT' },
];

/** Languages Cal.com accepts for `attendee.language`. */
export const ATTENDEE_LANGUAGES = [
	'ar', 'az', 'bg', 'bn', 'ca', 'cs', 'da', 'de', 'el', 'en', 'es', 'es-419', 'et', 'eu', 'fi',
	'fr', 'he', 'hr', 'hu', 'id', 'it', 'iw', 'ja', 'km', 'ko', 'lv', 'nl', 'no', 'pl', 'pt',
	'pt-BR', 'ro', 'ru', 'sk', 'sr', 'sv', 'ta', 'th', 'tr', 'uk', 'vi', 'zh-CN', 'zh-TW',
];
