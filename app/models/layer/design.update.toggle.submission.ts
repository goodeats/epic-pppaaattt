import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { UpdateLayerDesignFieldSchema } from './design.schema.update'
import { updateLayerDesignVisibleService } from './design.update.toggle.visible.service'
import { validateLayerParentSubmission } from './validation'

export const validateUpdateLayerDesignToggleSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	return await validateLayerParentSubmission(
		{
			userId,
			formData,
		},
		UpdateLayerDesignFieldSchema,
	)
}

export const handleUpdateLayerDesignToggleSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const { status, submission } =
		await validateUpdateLayerDesignToggleSubmission({
			userId,
			formData,
		})

	if (status === 'success') {
		const { success, message } = await updateLayerDesignVisibleService({
			userId,
			...submission.value,
		})
		return { status, submission, responseSuccess: success, message }
	}

	return { status, submission, responseSuccess: false }
}
