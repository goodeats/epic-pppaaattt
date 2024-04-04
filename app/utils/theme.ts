import { useFetcher } from '@remix-run/react'
import { z } from 'zod'
import { useHints } from './client-hints'
import { useRequestInfo } from './request-info'

export const ThemeFormSchema = z.object({
	theme: z.enum(['system', 'light', 'dark']),
})

/**
 * @returns the user's theme preference, or the client hint theme if the user
 * has not set a preference.
 */
export function useTheme() {
	const hints = useHints()
	const requestInfo = useRequestInfo()
	const optimisticMode = useOptimisticThemeMode()
	if (optimisticMode) {
		return optimisticMode === 'system' ? hints.theme : optimisticMode
	}
	return requestInfo.userPrefs.theme ?? hints.theme
}

/**
 * If the user's changing their theme mode preference, this will return the
 * value it's being changed to.
 */
export function useOptimisticThemeMode() {
	const themeFetcher = useFetcher({ key: 'theme-switch' })

	if (themeFetcher && themeFetcher.formData) {
		const submission = ThemeFormSchema.safeParse(themeFetcher.formData)

		if (submission.success) {
			return submission.data.theme
		}
	}
}
