import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { validateArtworkVersionParentSubmission } from '../validation'
import { UpdateArtworkVersionDesignReorderSchema } from './schema.update'
import { updateArtworkVersionDesignReorderMoveDownService } from './update.reorder.move-down.service'
import { updateArtworkVersionDesignReorderMoveUpService } from './update.reorder.move-up.service'

export const validateUpdateArtworkVersionDesignReorderSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	return await validateArtworkVersionParentSubmission(
		{
			userId,
			formData,
		},
		UpdateArtworkVersionDesignReorderSchema,
	)
}

export const handleUpdateArtworkVersionDesignReorderMoveDownSubmission =
	async ({ userId, formData }: IntentActionArgs) => {
		const { status, submission } =
			await validateUpdateArtworkVersionDesignReorderSubmission({
				userId,
				formData,
			})

		if (status === 'success') {
			const { success, message } =
				await updateArtworkVersionDesignReorderMoveDownService({
					userId,
					...submission.value,
				})
			return { status, submission, responseSuccess: success, message }
		}

		return { status, submission, responseSuccess: false }
	}

export const handleUpdateArtworkVersionDesignReorderMoveUpSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const { status, submission } =
		await validateUpdateArtworkVersionDesignReorderSubmission({
			userId,
			formData,
		})

	if (status === 'success') {
		const { success, message } =
			await updateArtworkVersionDesignReorderMoveUpService({
				userId,
				...submission.value,
			})
		return { status, submission, responseSuccess: success, message }
	}

	return { status, submission, responseSuccess: false }
}
