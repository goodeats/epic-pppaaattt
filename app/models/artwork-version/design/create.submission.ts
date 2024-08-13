import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { validateArtworkVersionParentSubmission } from '../validation'
import { createArtworkVersionDesignService } from './create.service'
import { NewArtworkVersionDesignSchema } from './schema.create'

export const validateNewArtworkVersionDesignSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	return await validateArtworkVersionParentSubmission(
		{
			userId,
			formData,
		},
		NewArtworkVersionDesignSchema,
	)
}

export const handleNewArtworkVersionDesignSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const { status, submission } =
		await validateNewArtworkVersionDesignSubmission({
			userId,
			formData,
		})

	if (status === 'success') {
		const { success, message } = await createArtworkVersionDesignService({
			userId,
			...submission.value,
		})
		return { status, submission, responseSuccess: success, message }
	}

	return { status, submission, responseSuccess: false }
}
