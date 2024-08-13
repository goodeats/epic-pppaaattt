import {
	json,
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { useHydrated } from 'remix-utils/use-hydrated'
import { serverOnly$ } from 'vite-env-only/macros'
import {
	handleFormData,
	handleRedirectIfNeeded,
} from '#app/utils/action-handling'
import { requireUserId } from '#app/utils/auth.server'
import { Routes } from '#app/utils/routes.const'
import { FetcherHex } from '#app/components/templates/form/fetcher-hex'
import { handleUpdateDesignTypeAttributeHexSubmission } from '#app/models/design/design.update.type.attribute.hex.submission'
import { EditDesignFillValueSchema } from '#app/models/design/fill/schema.update'

// https://www.epicweb.dev/full-stack-components

const route = Routes.RESOURCES.API.V1.UPDATE.DESIGN.TYPE.ATTRIBUTE.HEX

export const loader = serverOnly$(async ({ request }: LoaderFunctionArgs) => {
	await requireUserId(request)

	return json({})
})

export const action = serverOnly$(async ({ request }: ActionFunctionArgs) => {
	const userId = await requireUserId(request)
	const { formData, noJS } = await handleFormData({ request })

	const { status, submission, responseSuccess, message } =
		await handleUpdateDesignTypeAttributeHexSubmission({
			userId,
			formData,
		})

	await handleRedirectIfNeeded({ request, noJS })
	const body = { status, submission, message }
	const code = responseSuccess ? 201 : 422
	return json(body, { status: code })
})

type DesignTypeAttributeHexFormProps = {
	formId: string
	schema: typeof EditDesignFillValueSchema
	fieldName: string
	fieldValue: string
	tooltipText: string
	placeholder: string
	children?: JSX.Element
}

export const UpdateDesignTypeAttributeHexForm = ({
	schema,
	formId,
	fieldName,
	fieldValue,
	tooltipText,
	placeholder,
	children,
}: DesignTypeAttributeHexFormProps) => {
	let isHydrated = useHydrated()
	const fetcher = useFetcher<typeof action>({
		key: `${formId}-key`,
	})

	return (
		<FetcherHex
			fetcher={fetcher}
			fetcherKey={`${formId}-key`}
			route={route}
			schema={schema}
			formId={formId}
			fieldName={fieldName}
			fieldValue={fieldValue}
			tooltipText={tooltipText}
			placeholder={placeholder}
			isHydrated={isHydrated}
		>
			<div className="hidden">{children}</div>
		</FetcherHex>
	)
}
