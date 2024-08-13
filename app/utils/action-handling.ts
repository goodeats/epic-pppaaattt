import {
	unstable_createMemoryUploadHandler as createMemoryUploadHandler,
	unstable_parseMultipartFormData as parseMultipartFormData,
} from '@remix-run/node'
import { redirectBack } from 'remix-utils/redirect-back'
import { MAX_UPLOAD_SIZE } from '#app/schema/asset/image'
import { validateNoJS } from '#app/schema/form-data'

export const handleFormData = async ({
	request,
	multipart,
}: {
	request: Request
	multipart?: boolean
}) => {
	const formData = multipart
		? await parseMultipartFormData(
				request,
				createMemoryUploadHandler({ maxPartSize: MAX_UPLOAD_SIZE }),
			)
		: await request.formData()
	const noJS = validateNoJS({ formData })
	return { formData, noJS }
}

export const handleRedirectIfNeeded = async ({
	request,
	noJS,
}: {
	request: Request
	noJS?: boolean | null
}) => {
	if (noJS) {
		throw redirectBack(request, {
			fallback: '/',
		})
	}
}
