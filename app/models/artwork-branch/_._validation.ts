import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { ValidateArtworkBranchParentSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntitySubmission } from '#app/utils/conform-utils'
import { type CloneArtworkBranchArtworkVersionSchema } from './artwork-version.clone.schema'

type ArtworkBranchParentSchema = typeof CloneArtworkBranchArtworkVersionSchema

export const validateArtworkBranchParentSubmission = async (
	{ userId, formData }: IntentActionArgs,
	schema: ArtworkBranchParentSchema,
) => {
	const strategy = new ValidateArtworkBranchParentSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema,
		strategy,
	})
}
