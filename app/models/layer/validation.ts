import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import {
	type DeleteLayerDesignSchema,
	type NewLayerDesignSchema,
} from '#app/schema/design-layer'
import { ValidateLayerParentSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntitySubmission } from '#app/utils/conform-utils'

type LayerParentSchema =
	| typeof NewLayerDesignSchema
	| typeof DeleteLayerDesignSchema

export const validateLayerParentSubmission = async (
	{ userId, formData }: IntentActionArgs,
	schema: LayerParentSchema,
) => {
	const strategy = new ValidateLayerParentSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema,
		strategy,
	})
}
