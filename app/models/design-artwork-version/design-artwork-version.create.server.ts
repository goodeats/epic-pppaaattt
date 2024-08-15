import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { ValidateArtworkVersionParentSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntitySubmission } from '#app/utils/conform-utils'
import { NewArtworkVersionDesignSchema } from '../artwork-version/design/schema.create'

export const validateArtworkVersionNewDesignSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateArtworkVersionParentSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema: NewArtworkVersionDesignSchema,
		strategy,
	})
}
