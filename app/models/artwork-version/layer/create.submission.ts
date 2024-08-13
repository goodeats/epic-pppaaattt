import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { validateArtworkVersionParentSubmission } from '../validation'
import { createArtworkVersionLayerService } from './create.service'
import { NewArtworkVersionLayerSchema } from './schema.create'

export const validateNewArtworkVersionLayerSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	return await validateArtworkVersionParentSubmission(
		{
			userId,
			formData,
		},
		NewArtworkVersionLayerSchema,
	)
}

export const handleNewArtworkVersionLayerSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const { status, submission } = await validateNewArtworkVersionLayerSubmission(
		{
			userId,
			formData,
		},
	)

	if (status === 'success') {
		const { success, message } = await createArtworkVersionLayerService({
			userId,
			...submission.value,
		})
		return { status, submission, responseSuccess: success, message }
	}

	return { status, submission, responseSuccess: false }
}
