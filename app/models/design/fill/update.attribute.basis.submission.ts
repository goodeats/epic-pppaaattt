import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { validateDesignSubmission } from '../validation'
import { EditDesignFillBasisSchema } from './schema.update'
import { updateDesignFillBasisService } from './update.attribute.basis.service'

export const validateUpdateDesignFillBasisSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	return await validateDesignSubmission(
		{
			userId,
			formData,
		},
		EditDesignFillBasisSchema,
	)
}

export const handleUpdateDesignFillBasisSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const { status, submission } = await validateUpdateDesignFillBasisSubmission({
		userId,
		formData,
	})

	if (status === 'success') {
		const { success, message } = await updateDesignFillBasisService({
			userId,
			...submission.value,
		})
		return { status, submission, responseSuccess: success, message }
	}

	return { status, submission, responseSuccess: false }
}
