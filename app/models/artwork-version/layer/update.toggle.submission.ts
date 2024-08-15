import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { validateArtworkVersionParentSubmission } from '../validation'
import { UpdateArtworkVersionLayerFieldSchema } from './schema.update'
import { updateArtworkVersionLayerVisibleService } from './update.toggle.visible.service'

export const validateUpdateArtworkVersionLayerToggleSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	return await validateArtworkVersionParentSubmission(
		{
			userId,
			formData,
		},
		UpdateArtworkVersionLayerFieldSchema,
	)
}

export const handleUpdateArtworkVersionLayerToggleSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const { status, submission } =
		await validateUpdateArtworkVersionLayerToggleSubmission({
			userId,
			formData,
		})

	if (status === 'success') {
		const { success, message } = await updateArtworkVersionLayerVisibleService({
			userId,
			...submission.value,
		})
		return { status, submission, responseSuccess: success, message }
	}

	return { status, submission, responseSuccess: false }
}
