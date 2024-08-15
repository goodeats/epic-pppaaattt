import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { validateDesignSubmission } from '../validation'
import { EditDesignFillStyleSchema } from './schema.update'
import { updateDesignFillStyleService } from './update.attribute.style.service'

export const validateUpdateDesignFillStyleSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	return await validateDesignSubmission(
		{
			userId,
			formData,
		},
		EditDesignFillStyleSchema,
	)
}

export const handleUpdateDesignFillStyleSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const { status, submission } = await validateUpdateDesignFillStyleSubmission({
		userId,
		formData,
	})

	if (status === 'success') {
		const { success, message } = await updateDesignFillStyleService({
			userId,
			...submission.value,
		})

		return { status, submission, responseSuccess: success, message }
	}

	return { status, submission, responseSuccess: false }
}
