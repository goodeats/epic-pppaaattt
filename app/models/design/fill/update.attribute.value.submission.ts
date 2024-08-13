import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { validateDesignSubmission } from '../validation'
import { EditDesignFillValueSchema } from './schema.update'
import { updateDesignFillValueService } from './update.attribute.value.service'

export const validateUpdateDesignFillValueSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	return await validateDesignSubmission(
		{
			userId,
			formData,
		},
		EditDesignFillValueSchema,
	)
}

export const handleUpdateDesignFillValueSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const { status, submission } = await validateUpdateDesignFillValueSubmission({
		userId,
		formData,
	})

	if (status === 'success') {
		const { success, message } = await updateDesignFillValueService({
			userId,
			...submission.value,
		})
		return { status, submission, responseSuccess: success, message }
	}

	return { status, submission, responseSuccess: false }
}
