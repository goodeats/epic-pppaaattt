import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { validateArtworkVersionParentSubmission } from '../validation'
import { UpdateArtworkVersionLayerReorderSchema } from './schema.update'
import { updateArtworkVersionLayerReorderMoveDownService } from './update.reorder.move-down.service'
import { updateArtworkVersionLayerReorderMoveUpService } from './update.reorder.move-up.service'

export const validateUpdateArtworkVersionLayerReorderSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	return await validateArtworkVersionParentSubmission(
		{
			userId,
			formData,
		},
		UpdateArtworkVersionLayerReorderSchema,
	)
}

export const handleUpdateArtworkVersionLayerReorderMoveDownSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const { status, submission } =
		await validateUpdateArtworkVersionLayerReorderSubmission({
			userId,
			formData,
		})

	if (status === 'success') {
		const { success, message } =
			await updateArtworkVersionLayerReorderMoveDownService({
				userId,
				...submission.value,
			})
		return { status, submission, responseSuccess: success, message }
	}

	return { status, submission, responseSuccess: false }
}

export const handleUpdateArtworkVersionLayerReorderMoveUpSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const { status, submission } =
		await validateUpdateArtworkVersionLayerReorderSubmission({
			userId,
			formData,
		})

	if (status === 'success') {
		const { success, message } =
			await updateArtworkVersionLayerReorderMoveUpService({
				userId,
				...submission.value,
			})

		return { status, submission, responseSuccess: success, message }
	}

	return { status, submission, responseSuccess: false }
}
