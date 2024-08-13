import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { ValidateDesignSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntitySubmission } from '#app/utils/conform-utils'
import { type IDesignFillValidationSchema } from './fill/definitions'

type DesignSchema = IDesignFillValidationSchema

export const validateDesignSubmission = async (
	{ userId, formData }: IntentActionArgs,
	schema: DesignSchema,
) => {
	const strategy = new ValidateDesignSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema,
		strategy,
	})
}
