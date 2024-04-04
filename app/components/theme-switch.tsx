import { useForm } from '@conform-to/react'
import { useFetcher } from '@remix-run/react'
import { useRootLoaderData, type action } from '#app/root'
import { useOptimisticThemeMode } from '#app/utils/theme'
import { Icon } from './ui/icon'

export const ThemeSwitch = () => {
	const { requestInfo } = useRootLoaderData()
	const userPreference = requestInfo.userPrefs.theme

	const fetcher = useFetcher<typeof action>({
		key: `theme-switch`,
	})

	const [form] = useForm({
		id: 'theme-switch',
		lastSubmission: fetcher.data?.submission,
	})

	const optimisticMode = useOptimisticThemeMode()
	const mode = optimisticMode ?? userPreference ?? 'system'
	const nextMode =
		mode === 'system' ? 'light' : mode === 'light' ? 'dark' : 'system'
	const modeLabel = {
		light: (
			<Icon name="sun">
				<span className="sr-only">Light</span>
			</Icon>
		),
		dark: (
			<Icon name="moon">
				<span className="sr-only">Dark</span>
			</Icon>
		),
		system: (
			<Icon name="laptop">
				<span className="sr-only">System</span>
			</Icon>
		),
	}

	return (
		<fetcher.Form method="POST" {...form.props}>
			<input type="hidden" name="theme" value={nextMode} />
			<div className="flex gap-2">
				<button
					type="submit"
					className="flex h-8 w-8 cursor-pointer items-center justify-center"
				>
					{modeLabel[mode]}
				</button>
			</div>
		</fetcher.Form>
	)
}
