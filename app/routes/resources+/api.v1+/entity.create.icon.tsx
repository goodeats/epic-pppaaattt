import {
	json,
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { useHydrated } from 'remix-utils/use-hydrated'
import { serverOnly$ } from 'vite-env-only/macros'
import { FetcherIconButton } from '#app/components/templates/form/fetcher-icon-button'
import { IntentInput } from '#app/components/ui/input-hidden'
import { invalidIntentResponse } from '#app/constants/intent'
import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { handleNewArtworkVersionDesignSubmission } from '#app/models/artwork-version/design/create.submission'
import { type NewArtworkVersionDesignSchema } from '#app/models/artwork-version/design/schema.create'
import { handleNewArtworkVersionLayerSubmission } from '#app/models/artwork-version/layer/create.submission'
import { type NewArtworkVersionLayerSchema } from '#app/models/artwork-version/layer/schema.create'
import { type designTypeEnum } from '#app/models/design/definitions'
import { handleNewLayerDesignSubmission } from '#app/models/layer/design.create.submission'
import { type NewLayerDesignSchema } from '#app/schema/design-layer'
import {
	handleFormData,
	handleRedirectIfNeeded,
} from '#app/utils/action-handling'
import { requireUserId } from '#app/utils/auth.server'
import { resourceRouteApiV1 } from '#app/utils/routes.const'
import { type ExtractStringValues } from '#app/utils/typescript-helpers'

// https://www.epicweb.dev/full-stack-components

const route = `${resourceRouteApiV1}/entity/create/icon`

export const EntityCreateIconIntent = {
	ARTWORK_VERSION: {
		DESIGN: 'create-artwork-version-design',
		LAYER: 'create-artwork-version-layer',
	},
	LAYER: {
		DESIGN: 'create-layer-design',
	},
} as const
export type EntityCreateIconIntentValues = ExtractStringValues<
	typeof EntityCreateIconIntent
>
type EntityCreateIconSchema =
	| typeof NewArtworkVersionDesignSchema
	| typeof NewArtworkVersionLayerSchema
	| typeof NewLayerDesignSchema
type EntityCreateIconType = designTypeEnum | 'layer'

export const loader = serverOnly$(async ({ request }: LoaderFunctionArgs) => {
	await requireUserId(request)
	return json({})
})

const handleSubmission = async ({ userId, formData }: IntentActionArgs) => {
	const intent = formData.get('intent')

	switch (intent) {
		case EntityCreateIconIntent.ARTWORK_VERSION.DESIGN:
			return await handleNewArtworkVersionDesignSubmission({
				userId,
				formData,
			})
		case EntityCreateIconIntent.ARTWORK_VERSION.LAYER:
			return await handleNewArtworkVersionLayerSubmission({
				userId,
				formData,
			})
		case EntityCreateIconIntent.LAYER.DESIGN:
			return await handleNewLayerDesignSubmission({
				userId,
				formData,
			})
		default:
			return invalidIntentResponse
	}
}

export const action = serverOnly$(async ({ request }: ActionFunctionArgs) => {
	const userId = await requireUserId(request)
	const { formData, noJS } = await handleFormData({ request })

	const { status, submission, responseSuccess, message } =
		await handleSubmission({
			userId,
			formData,
		})

	await handleRedirectIfNeeded({ request, noJS })
	const body = { status, submission, message }
	const code = responseSuccess ? 201 : 422
	return json(body, { status: code })
})

export const EntityCreateIconForm = ({
	formId,
	intent,
	schema,
	type,
	children,
}: {
	formId: string
	intent: EntityCreateIconIntentValues
	schema: EntityCreateIconSchema
	type: EntityCreateIconType
	children?: JSX.Element
}) => {
	const iconText = `Add new ${type}`

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
			icon="plus"
			iconText={iconText}
			isHydrated={isHydrated}
		>
			<div className="hidden">
				<IntentInput intent={intent} />
				{children}
			</div>
		</FetcherIconButton>
	)
}
