import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { DeleteLayerDesignSchema } from '#app/schema/design-layer'
import { deleteLayerDesignService } from './design.delete.service'
import { validateLayerParentSubmission } from './validation'

export const validateDeleteLayerDesignSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	return await validateLayerParentSubmission(
		{ userId, formData },
		DeleteLayerDesignSchema,
	)
}

export const handleDeleteLayerDesignSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const { status, submission } = await validateDeleteLayerDesignSubmission({
		userId,
		formData,
	})

	if (status === 'success') {
		const { success, message } = await deleteLayerDesignService({
			userId,
			...submission.value,
		})
		return { status, submission, responseSuccess: success, message }
	}

	return { status, submission, responseSuccess: false }
}
