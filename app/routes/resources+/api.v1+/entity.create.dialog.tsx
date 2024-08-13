import {
	json,
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { useHydrated } from 'remix-utils/use-hydrated'
import { serverOnly$ } from 'vite-env-only/macros'
import { type DynamicFormFieldConfig } from '#app/components/templates/form/dynamic-form-field.js'
import { FetcherIconDialog } from '#app/components/templates/form/fetcher-icon-dialog'
import { type IconName } from '#app/components/ui/icon'
import { IntentInput } from '#app/components/ui/input-hidden'
import { invalidIntentResponse } from '#app/constants/intent'
import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { type CloneArtworkBranchArtworkVersionSchema } from '#app/models/artwork-branch/artwork-version.clone.schema.js'
import { handleCloneArtworkBranchArtworkVersionSubmission } from '#app/models/artwork-branch/artwork-version.clone.submission'
import {
	handleFormData,
	handleRedirectIfNeeded,
} from '#app/utils/action-handling'
import { requireUserId } from '#app/utils/auth.server'
import { resourceRouteApiV1 } from '#app/utils/routes.const'
import { type ExtractStringValues } from '#app/utils/typescript-helpers'
import { CloneExampleEntityExampleChildSchema } from '#dev/model-file-structure/entity.child.clone.schema.js'
import { handleCloneArtworkArtworkBranchSubmission } from '#app/models/artwork/artwork-branch.clone.submission.js'

// https://www.epicweb.dev/full-stack-components

const route = `${resourceRouteApiV1}/entity/create/dialog`

export const EntityCreateDialogIntent = {
	EXAMPLE_PARENT: {
		EXAMPLE_CHILD: 'create-example-child',
	},
	ARTWORK: {
		ARTWORK_BRANCH: 'create-artwork-branch',
	},
	ARTWORK_BRANCH: {
		ARTWORK_VERSION: 'create-artwork-branch-artwork-version',
	},
} as const
export type EntityCreateDialogIntentValues = ExtractStringValues<
	typeof EntityCreateDialogIntent
>
type EntityCreateSchema =
	| typeof CloneArtworkBranchArtworkVersionSchema
	| typeof CloneExampleEntityExampleChildSchema

export const loader = serverOnly$(async ({ request }: LoaderFunctionArgs) => {
	await requireUserId(request)
	return json({})
})

const handleSubmission = async ({ userId, formData }: IntentActionArgs) => {
	const intent = formData.get('intent')

	switch (intent) {
		case EntityCreateDialogIntent.ARTWORK.ARTWORK_BRANCH:
			return await handleCloneArtworkArtworkBranchSubmission({
				userId,
				formData,
			})
		case EntityCreateDialogIntent.ARTWORK_BRANCH.ARTWORK_VERSION:
			return await handleCloneArtworkBranchArtworkVersionSubmission({
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

export const EntityCreateDialogForm = ({
	formId,
	intent,
	schema,
	icon,
	iconText,
	tooltipText,
	title,
	description,
	formFields,
	children,
	content,
	onSuccessfulSubmission,
}: {
	formId: string
	intent: EntityCreateDialogIntentValues
	schema: EntityCreateSchema
	icon: IconName
	iconText: string
	tooltipText?: string
	title: string
	description?: string
	formFields: DynamicFormFieldConfig[]
	children?: JSX.Element
	content?: JSX.Element
	onSuccessfulSubmission: (data: any) => void
}) => {
	let isHydrated = useHydrated()
	const fetcher = useFetcher<typeof action>({
		key: `${formId}-key`,
	})

	return (
		<FetcherIconDialog
			fetcher={fetcher}
			route={route}
			schema={schema}
			formId={formId}
			icon={icon}
			iconText={iconText}
			tooltipText={tooltipText}
			title={title}
			description={description}
			formFields={formFields}
			content={content}
			isHydrated={isHydrated}
			onSuccessfulSubmission={onSuccessfulSubmission}
		>
			<div className="hidden">
				<IntentInput intent={intent} />
				{children}
			</div>
		</FetcherIconDialog>
	)
}
