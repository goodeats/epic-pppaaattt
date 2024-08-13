import {
	json,
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { useHydrated } from 'remix-utils/use-hydrated'
import { serverOnly$ } from 'vite-env-only/macros'
import { FetcherIconButton } from '#app/components/templates/form/fetcher-icon-button'
import { type IconName } from '#app/components/ui/icon'
import { IntentInput } from '#app/components/ui/input-hidden'
import { invalidIntentResponse } from '#app/constants/intent'
import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { type UpdateArtworkVersionDesignFieldSchema } from '#app/models/artwork-version/design/schema.update'
import { handleUpdateArtworkVersionDesignToggleSubmission } from '#app/models/artwork-version/design/update.toggle.submission'
import { handleUpdateArtworkVersionLayerToggleSubmission } from '#app/models/artwork-version/layer/update.toggle.submission'
import { type UpdateLayerDesignFieldSchema } from '#app/models/layer/design.schema.update'
import { handleUpdateLayerDesignToggleSubmission } from '#app/models/layer/design.update.toggle.submission'
import {
	handleFormData,
	handleRedirectIfNeeded,
} from '#app/utils/action-handling'
import { requireUserId } from '#app/utils/auth.server'
import { resourceRouteApiV1 } from '#app/utils/routes.const'
import { type ExtractStringValues } from '#app/utils/typescript-helpers'

// https://www.epicweb.dev/full-stack-components

const route = `${resourceRouteApiV1}/toggle/entity/attribute`

export const EntityToggleAttributeIntent = {
	ARTWORK_VERSION: {
		WATERMARK: 'toggle-artwork-version-watermark',
		DESIGN: {
			VISIBLE: 'toggle-artwork-version-design-visible',
		},
		LAYER: {
			VISIBLE: 'toggle-artwork-version-layer-visible',
		},
	},
	LAYER: {
		DESIGN: {
			VISIBLE: 'toggle-layer-design-visible',
		},
	},
} as const
export type EntityToggleAttributeIntentValues = ExtractStringValues<
	typeof EntityToggleAttributeIntent
>
type EntityToggleAttributeSchema =
	| typeof UpdateArtworkVersionDesignFieldSchema
	| typeof UpdateLayerDesignFieldSchema

export const loader = serverOnly$(async ({ request }: LoaderFunctionArgs) => {
	await requireUserId(request)

	return json({})
})

const handleSubmission = async ({ userId, formData }: IntentActionArgs) => {
	const intent = formData.get('intent')

	switch (intent) {
		case EntityToggleAttributeIntent.ARTWORK_VERSION.DESIGN.VISIBLE:
			return await handleUpdateArtworkVersionDesignToggleSubmission({
				userId,
				formData,
			})
		case EntityToggleAttributeIntent.ARTWORK_VERSION.LAYER.VISIBLE:
			return await handleUpdateArtworkVersionLayerToggleSubmission({
				userId,
				formData,
			})
		case EntityToggleAttributeIntent.LAYER.DESIGN.VISIBLE:
			return await handleUpdateLayerDesignToggleSubmission({
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

export const EntityToggleAttributeForm = ({
	formId,
	intent,
	schema,
	condition,
	iconTrue,
	iconTrueText,
	iconFalse,
	iconFalseText,
	children,
}: {
	formId: string
	intent: EntityToggleAttributeIntentValues
	schema: EntityToggleAttributeSchema
	condition: boolean
	iconTrue: IconName
	iconTrueText: string
	iconFalse: IconName
	iconFalseText: string
	children?: JSX.Element
}) => {
	const icon = condition ? iconTrue : iconFalse
	const iconText = condition ? iconTrueText : iconFalseText

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
			icon={icon}
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
