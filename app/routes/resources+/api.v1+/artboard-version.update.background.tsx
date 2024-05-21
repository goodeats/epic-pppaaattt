import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import { json, type ActionFunctionArgs } from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { useRef } from 'react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { redirectBack } from 'remix-utils/redirect-back'
import { useHydrated } from 'remix-utils/use-hydrated'
import { Input } from '#app/components/ui/input'
import { type IArtboardVersion } from '#app/models/artboard-version/artboard-version.server'
import { validateArtboardVersionBackgroundSubmission } from '#app/models/artboard-version/artboard-version.update.server'
import { ArtboardVersionBackgroundSchema } from '#app/schema/artboard-version'
import { validateNoJS } from '#app/schema/form-data'
import { updateArtboardVersionBackgroundService } from '#app/services/artboard/version/update.service'
import { requireUserId } from '#app/utils/auth.server'
import { useDebounce, useIsPending } from '#app/utils/misc'
import { Routes } from '#app/utils/routes.const'

const route = Routes.RESOURCES.API.V1.ARTBOARD_VERSION.UPDATE.BACKGROUND
const schema = ArtboardVersionBackgroundSchema

export async function action({ request }: ActionFunctionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	const noJS = validateNoJS({ formData })

	const { status, submission } =
		await validateArtboardVersionBackgroundSubmission({
			userId,
			formData,
		})
	let updateSucess = false
	if (status === 'success') {
		const { success } = await updateArtboardVersionBackgroundService({
			...submission.value,
		})
		updateSucess = success
	}

	if (noJS) {
		throw redirectBack(request, {
			fallback: '/',
		})
	}

	return json(
		{ status, submission },
		{ status: status === 'error' || !updateSucess ? 400 : 200 },
	)
}

export const ArtboardVersionBackground = ({
	version,
}: {
	version: IArtboardVersion
}) => {
	const versionId = version.id
	const formId = `artboard-version-update-background-${versionId}`

	const fetcher = useFetcher<typeof action>()
	const lastSubmission = fetcher.data?.submission
	const isPending = useIsPending()
	let isHydrated = useHydrated()
	const [form, fields] = useForm({
		id: formId,
		constraint: getFieldsetConstraint(schema),
		lastSubmission,
		shouldValidate: 'onInput',
		shouldRevalidate: 'onInput',
		onValidate: ({ formData }) => {
			// set hex chars to uppercase
			const value = formData.get('value')
			if (typeof value === 'string') {
				formData.set('value', value.toUpperCase())
			}
			return parse(formData, { schema })
		},
		onSubmit: async (event, { formData }) => {
			event.preventDefault()
			fetcher.submit(formData, {
				method: 'POST',
				action: route,
			})
		},
		defaultValue: {
			value: version.background || '',
		},
	})
	const submitRef = useRef<HTMLButtonElement>(null)

	const handleChangeSubmit = useDebounce((f: HTMLFormElement) => {
		submitRef.current?.click()
	}, 400)

	// still do this until conform can change the value to uppercase
	// or fetcher can handle it, like with theme
	const handleInput = (input: HTMLInputElement) => {
		input.value = input.value.toUpperCase()
	}

	return (
		<fetcher.Form
			method="POST"
			action={route}
			onChange={e => handleChangeSubmit(e.currentTarget)}
			{...form.props}
		>
			<AuthenticityTokenInput />

			<input type="hidden" name="no-js" value={String(!isHydrated)} />
			<input type="hidden" name="id" value={versionId} />

			<Input
				maxLength={6}
				className="flex h-8"
				onInput={e => handleInput(e.currentTarget)}
				disabled={isPending}
				{...conform.input(fields.background, {
					ariaAttributes: true,
				})}
			/>

			{/* form onChange click this to trigger useForm */}
			<button type="submit" ref={submitRef} style={{ display: 'none' }}>
				Submit
			</button>
		</fetcher.Form>
	)
}
