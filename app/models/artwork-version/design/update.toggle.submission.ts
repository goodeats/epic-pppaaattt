import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { validateArtworkVersionParentSubmission } from '../validation'
import { UpdateArtworkVersionDesignFieldSchema } from './schema.update'
import { updateArtworkVersionDesignVisibleService } from './update.toggle.visible.service'

export const validateUpdateArtworkVersionDesignToggleSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	return await validateArtworkVersionParentSubmission(
		{
			userId,
			formData,
		},
		UpdateArtworkVersionDesignFieldSchema,
	)
}

export const handleUpdateArtworkVersionDesignToggleSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const { status, submission } =
		await validateUpdateArtworkVersionDesignToggleSubmission({
			userId,
			formData,
		})

	if (status === 'success') {
		const { success, message } = await updateArtworkVersionDesignVisibleService(
			{
				userId,
				...submission.value,
			},
		)
		return { status, submission, responseSuccess: success, message }
	}

	return { status, submission, responseSuccess: false }
}
