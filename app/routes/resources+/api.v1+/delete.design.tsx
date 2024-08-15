import {
	json,
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { useHydrated } from 'remix-utils/use-hydrated'
import { serverOnly$ } from 'vite-env-only/macros'
import { FetcherIconButton } from '#app/components/templates/form/fetcher-icon-button'
import { type IDesign } from '#app/models/design/definitions'
import { handleDeleteDesignSubmission } from '#app/models/design/design.delete.submission'
import { type DeleteArtworkVersionDesignSchema } from '#app/schema/design-artwork-version'
import { type DeleteLayerDesignSchema } from '#app/schema/design-layer'
import {
	handleFormData,
	handleRedirectIfNeeded,
} from '#app/utils/action-handling'
import { requireUserId } from '#app/utils/auth.server'
import { Routes } from '#app/utils/routes.const'

// https://www.epicweb.dev/full-stack-components

const route = Routes.RESOURCES.API.V1.DELETE.DESIGN

export const loader = serverOnly$(async ({ request }: LoaderFunctionArgs) => {
	await requireUserId(request)
	return json({})
})

export const action = serverOnly$(async ({ request }: ActionFunctionArgs) => {
	const userId = await requireUserId(request)
	const { formData, noJS } = await handleFormData({ request })

	const { status, submission, responseSuccess, message } =
		await handleDeleteDesignSubmission({
			userId,
			formData,
		})

	await handleRedirectIfNeeded({ request, noJS })
	const body = { status, submission, message }
	const code = responseSuccess ? 201 : 422
	return json(body, { status: code })
})

type DesignDeleteFormProps = {
	design: IDesign
	formId: string
	schema:
		| typeof DeleteArtworkVersionDesignSchema
		| typeof DeleteLayerDesignSchema
	children?: JSX.Element
}

export const DeleteDesignForm = ({
	design,
	schema,
	formId,
	children,
}: DesignDeleteFormProps) => {
	const iconText = `Delete ${design.type}`

	let isHydrated = useHydrated()
	const fetcher = useFetcher<typeof action>({
		key: `${formId}-key`,
	})

	return (
		<FetcherIconButton
			fetcher={fetcher}
			route={route}
			schema={schema}
			formId={formId}
			icon="minus"
			iconText={iconText}
			isHydrated={isHydrated}
		>
			<div className="hidden">{children}</div>
		</FetcherIconButton>
	)
}
