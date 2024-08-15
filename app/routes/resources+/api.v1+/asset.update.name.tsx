import {
	json,
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { useHydrated } from 'remix-utils/use-hydrated'
import { FetcherText } from '#app/components/templates/form/fetcher-text'
import { type IAssetType } from '#app/models/asset/asset.server'
import { EditAssetImageFitSchema } from '#app/schema/asset/image'
import {
	handleFormData,
	handleRedirectIfNeeded,
} from '#app/utils/action-handling'
import { requireUserId } from '#app/utils/auth.server'
import { Routes } from '#app/utils/routes.const'

// https://www.epicweb.dev/full-stack-components

const route = Routes.RESOURCES.API.V1.DESIGN.TYPE.FILL.UPDATE.VALUE
const schema = EditAssetImageFitSchema

// auth GET request to endpoint
export async function loader({ request }: LoaderFunctionArgs) {
	await requireUserId(request)
	return json({})
}

export async function action({ request }: ActionFunctionArgs) {
	await requireUserId(request)
	const { noJS } = await handleFormData({ request })

	const { status, submission, responseSuccess, message } = {
		status: 'error',
		submission: null,
		responseSuccess: false,
		message: 'Invalid intent',
	}

	await handleRedirectIfNeeded({ request, noJS })
	const body = { status, submission, message }
	const code = responseSuccess ? 201 : 422
	return json(body, { status: code })
}

export const AssetUpdateName = ({
	asset,
	formLocation = '',
}: {
	asset: IAssetType
	formLocation?: string
}) => {
	const assetId = asset.id
	const field = 'name'
	const fetcherKey = `asset-update-${field}-${assetId}`
	const formId = `${fetcherKey}${formLocation ? `-${formLocation}` : ''}`
	const value = asset[field]

	let isHydrated = useHydrated()
	const fetcher = useFetcher<typeof action>({
		key: fetcherKey,
	})

	return (
		<FetcherText
			fetcher={fetcher}
			fetcherKey={fetcherKey}
			route={route}
			schema={schema}
			formId={formId}
			fieldName={field}
			fieldValue={value}
			tooltipText={`Fill ${field}`}
			isHydrated={isHydrated}
			placeholder={`Select a ${field}`}
			disabled
		>
			<div className="hidden">
				<input type="hidden" name="id" value={assetId} />
			</div>
		</FetcherText>
	)
}
