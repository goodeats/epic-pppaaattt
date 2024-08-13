import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { ValidateArtworkParentSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntitySubmission } from '#app/utils/conform-utils'
import { type CloneArtworkArtworkBranchSchema } from './artwork-branch.clone.schema'

type ArtworkParentSchema = typeof CloneArtworkArtworkBranchSchema

export const validateArtworkParentSubmission = async (
	{ userId, formData }: IntentActionArgs,
	schema: ArtworkParentSchema,
) => {
	const strategy = new ValidateArtworkParentSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema,
		strategy,
	})
}
