import { INTENT, invalidIntentResponse } from '#app/constants/intent'
import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { handleDeleteArtworkVersionDesignSubmission } from '../artwork-version/design/delete.submission'
import { handleDeleteLayerDesignSubmission } from '../layer/design.delete.submission'

export const handleDeleteDesignSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const intent = formData.get('intent')

	switch (intent) {
		case INTENT.DESIGN.DELETE.ARTWORK_VERSION:
			return await handleDeleteArtworkVersionDesignSubmission({
				userId,
				formData,
			})
		case INTENT.DESIGN.DELETE.LAYER:
			return await handleDeleteLayerDesignSubmission({ userId, formData })
		default:
			return invalidIntentResponse
	}
}
