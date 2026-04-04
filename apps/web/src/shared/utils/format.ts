export function formatDate(date: string | Date) {
	return new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	}).format(new Date(date))
}

export function formatDateTime(date: string | Date) {
	return new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	}).format(new Date(date))
}

export function formatRelative(date: string | Date) {
	const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
	const diff = (new Date(date).getTime() - Date.now()) / 1000

	if (Math.abs(diff) < 60) return rtf.format(Math.round(diff), 'second')
	if (Math.abs(diff) < 3600) return rtf.format(Math.round(diff / 60), 'minute')
	if (Math.abs(diff) < 86400) return rtf.format(Math.round(diff / 3600), 'hour')
	return rtf.format(Math.round(diff / 86400), 'day')
}
