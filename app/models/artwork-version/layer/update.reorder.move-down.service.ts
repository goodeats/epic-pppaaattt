import { LinkedListNodeTypeEnum } from '#app/models/__shared/linked-list.definitions'
import { moveLinkedListEntityDownService } from '#app/models/__shared/linked-list.node.move-down.service'
import { type ILayerUpdatedResponse } from '#app/models/layer/definitions.update'
import { verifyLayer } from '#app/models/layer/layer.get.server'
import { getOptionalZodErrorMessage } from '#app/utils/misc'
import { verifyArtworkVersion } from '../artwork-version.get.server'
import { type IArtworkVersionLayerUpdateOrderSubmission } from './definitions.update'

export const updateArtworkVersionLayerReorderMoveDownService = async ({
	userId,
	id,
	artworkVersionId,
}: IArtworkVersionLayerUpdateOrderSubmission): Promise<ILayerUpdatedResponse> => {
	try {
		// Step 1: verify the artwork version exists
		await verifyArtworkVersion({
			where: { id: artworkVersionId, ownerId: userId },
		})

		// Step 2: verify the layer exists
		const layer = await verifyLayer({
			where: { id, artworkVersionId, ownerId: userId },
		})

		// Step 3: move the layer down
		return await moveLinkedListEntityDownService({
			userId,
			id,
			type: LinkedListNodeTypeEnum.LAYER,
		})
	} catch (error) {
		return {
			success: false,
			message: getOptionalZodErrorMessage(error),
		}
	}
}
