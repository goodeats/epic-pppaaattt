import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { validateArtworkVersionParentSubmission } from '../validation'
import { deleteArtworkVersionDesignService } from './delete.service'
import { DeleteArtworkVersionDesignSchema } from './schema.delete'

export const validateDeleteArtworkVersionDesignSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	return await validateArtworkVersionParentSubmission(
		{ userId, formData },
		DeleteArtworkVersionDesignSchema,
	)
}

export const handleDeleteArtworkVersionDesignSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const { status, submission } =
		await validateDeleteArtworkVersionDesignSubmission({
			userId,
			formData,
		})

	if (status === 'success') {
		const { success, message } = await deleteArtworkVersionDesignService({
			userId,
			...submission.value,
		})
		return { status, submission, responseSuccess: success, message }
	}

	return { status, submission, responseSuccess: false }
}
