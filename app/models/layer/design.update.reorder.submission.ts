import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { UpdateLayerDesignReorderSchema } from './design.schema.update'
import { updateLayerDesignReorderMoveDownService } from './design.update.reorder.move-down.service'
import { updateLayerDesignReorderMoveUpService } from './design.update.reorder.move-up.service'
import { validateLayerParentSubmission } from './validation'

export const validateUpdateLayerDesignReorderSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	return await validateLayerParentSubmission(
		{
			userId,
			formData,
		},
		UpdateLayerDesignReorderSchema,
	)
}

export const handleUpdateLayerDesignReorderMoveDownSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const { status, submission } =
		await validateUpdateLayerDesignReorderSubmission({
			userId,
			formData,
		})

	if (status === 'success') {
		const { success, message } = await updateLayerDesignReorderMoveDownService({
			userId,
			...submission.value,
		})
		return { status, submission, responseSuccess: success, message }
	}

	return { status, submission, responseSuccess: false }
}

export const handleUpdateLayerDesignReorderMoveUpSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const { status, submission } =
		await validateUpdateLayerDesignReorderSubmission({
			userId,
			formData,
		})

	if (status === 'success') {
		const { success, message } = await updateLayerDesignReorderMoveUpService({
			userId,
			...submission.value,
		})
		return { status, submission, responseSuccess: success, message }
	}

	return { status, submission, responseSuccess: false }
}
