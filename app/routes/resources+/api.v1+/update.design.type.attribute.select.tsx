import {
	json,
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { useHydrated } from 'remix-utils/use-hydrated'
import { serverOnly$ } from 'vite-env-only/macros'
import { FetcherSelect } from '#app/components/templates/form/fetcher-select'
import { handleUpdateDesignTypeAttributeSelectSubmission } from '#app/models/design/design.update.type.attribute.select.submission'
import { type FillStyleTypeEnum } from '#app/models/design/fill/schema'
import {
	type EditDesignFillBasisSchema,
	type EditDesignFillStyleSchema,
} from '#app/models/design/fill/schema.update'
import { type FillBasisTypeEnum } from '#app/schema/fill'
import {
	handleFormData,
	handleRedirectIfNeeded,
} from '#app/utils/action-handling'
import { requireUserId } from '#app/utils/auth.server'
import { schemaEnumToSelectOptions } from '#app/utils/forms'
import { Routes } from '#app/utils/routes.const'

// https://www.epicweb.dev/full-stack-components

const route = Routes.RESOURCES.API.V1.UPDATE.DESIGN.TYPE.ATTRIBUTE.SELECT

export const loader = serverOnly$(async ({ request }: LoaderFunctionArgs) => {
	await requireUserId(request)

	return json({})
})

export const action = serverOnly$(async ({ request }: ActionFunctionArgs) => {
	const userId = await requireUserId(request)
	const { formData, noJS } = await handleFormData({ request })

	const { status, submission, responseSuccess, message } =
		await handleUpdateDesignTypeAttributeSelectSubmission({
			userId,
			formData,
		})

	await handleRedirectIfNeeded({ request, noJS })
	const body = { status, submission, message }
	const code = responseSuccess ? 201 : 422
	return json(body, { status: code })
})

type DesignTypeAttributeSelectFormProps = {
	formId: string
	schema: typeof EditDesignFillBasisSchema | typeof EditDesignFillStyleSchema
	fieldName: string
	fieldValue: string
	enumSchema: typeof FillBasisTypeEnum | typeof FillStyleTypeEnum
	tooltipText: string
	placeholder: string
	children?: JSX.Element
}

export const UpdateDesignTypeAttributeSelectForm = ({
	schema,
	formId,
	fieldName,
	fieldValue,
	enumSchema,
	tooltipText,
	placeholder,
	children,
}: DesignTypeAttributeSelectFormProps) => {
	const options = schemaEnumToSelectOptions(enumSchema)

	let isHydrated = useHydrated()
	const fetcher = useFetcher<typeof action>({
		key: `${formId}-key`,
	})

	return (
		<FetcherSelect
			fetcher={fetcher}
			fetcherKey={`${formId}-key`}
			route={route}
			schema={schema}
			formId={formId}
			fieldName={fieldName}
			fieldValue={fieldValue}
			options={options}
			tooltipText={tooltipText}
			placeholder={placeholder}
			isHydrated={isHydrated}
		>
			<div className="hidden">{children}</div>
		</FetcherSelect>
	)
}
