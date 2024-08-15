import {
	json,
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { useHydrated } from 'remix-utils/use-hydrated'
import { serverOnly$ } from 'vite-env-only/macros'
import { FetcherIconButtonReorder } from '#app/components/templates/form/fetcher-icon-button-reorder'
import { type IconName } from '#app/components/ui/icon'
import { type ILinkedListNodeUpdateOrderData } from '#app/models/__shared/linked-list.definitions.update'
import { handleUpdateLinkedListNodeReorderSubmission } from '#app/models/__shared/linked-list.node.update.reorder.submission'
import { type UpdateArtworkVersionDesignReorderSchema } from '#app/models/artwork-version/design/schema.update'
import { type UpdateArtworkVersionLayerReorderSchema } from '#app/models/artwork-version/layer/schema.update'
import { type UpdateLayerDesignReorderSchema } from '#app/models/layer/design.schema.update'
import {
	handleFormData,
	handleRedirectIfNeeded,
} from '#app/utils/action-handling'
import { requireUserId } from '#app/utils/auth.server'
import { Routes } from '#app/utils/routes.const'

// https://www.epicweb.dev/full-stack-components

const route = Routes.RESOURCES.API.V1.UPDATE.LINKED_LIST.NODE.MOVE

export const loader = serverOnly$(async ({ request }: LoaderFunctionArgs) => {
	await requireUserId(request)
	return json({})
})

export const action = serverOnly$(async ({ request }: ActionFunctionArgs) => {
	const userId = await requireUserId(request)
	const { formData, noJS } = await handleFormData({ request })

	const { status, submission, responseSuccess, message } =
		await handleUpdateLinkedListNodeReorderSubmission({
			userId,
			formData,
		})

	await handleRedirectIfNeeded({ request, noJS })
	const body = { status, submission, message }
	const code = responseSuccess ? 201 : 422
	return json(body, { status: code })
})

export const UpdateLinkedListNodeMoveForm = ({
	formId,
	schema,
	direction,
	atTopOrBottom,
	children,
}: {
	formId: string
	schema:
		| typeof UpdateArtworkVersionDesignReorderSchema
		| typeof UpdateArtworkVersionLayerReorderSchema
		| typeof UpdateLayerDesignReorderSchema
	direction: ILinkedListNodeUpdateOrderData['direction']
	atTopOrBottom: boolean
	children: JSX.Element
}) => {
	const icon = `chevron-${direction}` as IconName
	const iconText = `Move ${direction}`

	let isHydrated = useHydrated()
	const fetcher = useFetcher<typeof action>({
		key: `${formId}-key`,
	})

	return (
		<FetcherIconButtonReorder
			fetcher={fetcher}
			route={route}
			schema={schema}
			formId={formId}
			icon={icon}
			iconText={iconText}
			disabled={atTopOrBottom}
			isHydrated={isHydrated}
		>
			{children}
		</FetcherIconButtonReorder>
	)
}
