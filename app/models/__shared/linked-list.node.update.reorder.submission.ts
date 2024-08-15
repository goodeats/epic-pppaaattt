import { INTENT, invalidIntentResponse } from '#app/constants/intent'
import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import {
	handleUpdateArtworkVersionDesignReorderMoveDownSubmission,
	handleUpdateArtworkVersionDesignReorderMoveUpSubmission,
} from '../artwork-version/design/update.reorder.submission'
import {
	handleUpdateArtworkVersionLayerReorderMoveDownSubmission,
	handleUpdateArtworkVersionLayerReorderMoveUpSubmission,
} from '../artwork-version/layer/update.reorder.submission'
import {
	handleUpdateLayerDesignReorderMoveDownSubmission,
	handleUpdateLayerDesignReorderMoveUpSubmission,
} from '../layer/design.update.reorder.submission'

export const handleUpdateLinkedListNodeReorderSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const intent = formData.get('intent')

	switch (intent) {
		case INTENT.DESIGN.UPDATE.REORDER.ARTWORK_VERSION.MOVE_DOWN:
			return await handleUpdateArtworkVersionDesignReorderMoveDownSubmission({
				userId,
				formData,
			})
		case INTENT.DESIGN.UPDATE.REORDER.ARTWORK_VERSION.MOVE_UP:
			return await handleUpdateArtworkVersionDesignReorderMoveUpSubmission({
				userId,
				formData,
			})
		case INTENT.DESIGN.UPDATE.REORDER.LAYER.MOVE_DOWN:
			return await handleUpdateLayerDesignReorderMoveDownSubmission({
				userId,
				formData,
			})
		case INTENT.DESIGN.UPDATE.REORDER.LAYER.MOVE_UP:
			return await handleUpdateLayerDesignReorderMoveUpSubmission({
				userId,
				formData,
			})
		case INTENT.LAYER.UPDATE.REORDER.ARTWORK_VERSION.MOVE_DOWN:
			return await handleUpdateArtworkVersionLayerReorderMoveDownSubmission({
				userId,
				formData,
			})
		case INTENT.LAYER.UPDATE.REORDER.ARTWORK_VERSION.MOVE_UP:
			return await handleUpdateArtworkVersionLayerReorderMoveUpSubmission({
				userId,
				formData,
			})
		default:
			return invalidIntentResponse
	}
}
