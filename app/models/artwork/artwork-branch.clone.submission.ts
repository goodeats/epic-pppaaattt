import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { CloneArtworkArtworkBranchSchema } from './artwork-branch.clone.schema'
import { cloneArtworkArtworkBranchService } from './artwork-branch.clone.service'
import { validateArtworkParentSubmission } from './validation'

export const validateCloneArtworkArtworkBranchSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	return await validateArtworkParentSubmission(
		{
			userId,
			formData,
		},
		CloneArtworkArtworkBranchSchema,
	)
}

export const handleCloneArtworkArtworkBranchSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const { status, submission } =
		await validateCloneArtworkArtworkBranchSubmission({
			userId,
			formData,
		})

	if (status === 'success') {
		const { success, message } = await cloneArtworkArtworkBranchService({
			userId,
			...submission.value,
		})
		return {
			status: success ? 'success' : 'error',
			submission,
			responseSuccess: success,
			message,
		}
	}

	return { status, submission, responseSuccess: false }
}
