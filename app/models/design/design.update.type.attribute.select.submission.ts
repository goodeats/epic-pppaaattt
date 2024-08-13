import { INTENT } from '#app/constants/intent'
import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { handleUpdateDesignFillBasisSubmission } from './fill/update.attribute.basis.submission'
import { handleUpdateDesignFillStyleSubmission } from './fill/update.attribute.style.submission'

export const handleUpdateDesignTypeAttributeSelectSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const intent = formData.get('intent')

	switch (intent) {
		case INTENT.DESIGN.UPDATE.TYPE.ATTRIBUTE.SELECT.FILL_BASIS:
			return await handleUpdateDesignFillBasisSubmission({
				userId,
				formData,
			})
		case INTENT.DESIGN.UPDATE.TYPE.ATTRIBUTE.SELECT.FILL_STYLE:
			return await handleUpdateDesignFillStyleSubmission({
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
