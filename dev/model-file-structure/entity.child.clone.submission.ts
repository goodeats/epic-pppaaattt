import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { validateExampleEntityParentSubmission } from './entity._._validation'
import { CloneExampleEntityExampleChildSchema } from './entity.child.clone.schema'
import { cloneExampleEntityExampleChildService } from './entity.child.clone.service'

export const validateCloneExampleEntityExampleChildSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	return await validateExampleEntityParentSubmission(
		{ userId, formData },
		CloneExampleEntityExampleChildSchema,
	)
}

export const handleCloneExampleEntityExampleChildSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const { status, submission } =
		await validateCloneExampleEntityExampleChildSubmission({
			userId,
			formData,
		})

	if (status === 'success') {
		const { success, message } = await cloneExampleEntityExampleChildService({
			userId,
			...submission.value,
		})
		return { status, submission, responseSuccess: success, message }
	}

	return { status, submission, responseSuccess: false }
}
