import { INTENT } from '#app/constants/intent'
import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { handleUpdateDesignFillValueSubmission } from './fill/update.attribute.value.submission'

export const handleUpdateDesignTypeAttributeHexSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const intent = formData.get('intent')

	switch (intent) {
		case INTENT.DESIGN.UPDATE.TYPE.ATTRIBUTE.HEX.FILL_VALUE:
			return await handleUpdateDesignFillValueSubmission({
				userId,
				formData,
			})
		// case 'create-layer-design':
		//   return await handleCreateLayerDesignSubmission({ userId, formData })
		default:
			return {
				status: 'error',
				submission: null,
				responseSuccess: false,
				message: 'Invalid intent',
			}
	}
}
