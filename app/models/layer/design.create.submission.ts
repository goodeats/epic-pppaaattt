import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { createLayerDesignService } from './design.create.service'
import { NewLayerDesignSchema } from './design.schema.create'
import { validateLayerParentSubmission } from './validation'

export const validateNewLayerDesignSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	return await validateLayerParentSubmission(
		{
			userId,
			formData,
		},
		NewLayerDesignSchema,
	)
}

export const handleNewLayerDesignSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const { status, submission } = await validateNewLayerDesignSubmission({
		userId,
		formData,
	})

	if (status === 'success') {
		const { success, message } = await createLayerDesignService({
			userId,
			...submission.value,
		})
		return { status, submission, responseSuccess: success, message }
	}

	return { status, submission, responseSuccess: false }
}
