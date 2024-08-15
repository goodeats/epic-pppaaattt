import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { validateArtworkBranchParentSubmission } from './_._validation'
import { CloneArtworkBranchArtworkVersionSchema } from './artwork-version.clone.schema'
import { cloneArtworkBranchArtworkVersionService } from './artwork-version.clone.service'

export const validateCloneArtworkBranchArtworkVersionSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	return await validateArtworkBranchParentSubmission(
		{
			userId,
			formData,
		},
		CloneArtworkBranchArtworkVersionSchema,
	)
}

export const handleCloneArtworkBranchArtworkVersionSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const { status, submission } =
		await validateCloneArtworkBranchArtworkVersionSubmission({
			userId,
			formData,
		})

	if (status === 'success') {
		const { success, message } = await cloneArtworkBranchArtworkVersionService({
			userId,
			...submission.value,
		})
		return { status, submission, responseSuccess: success, message }
	}

	return { status, submission, responseSuccess: false }
}
