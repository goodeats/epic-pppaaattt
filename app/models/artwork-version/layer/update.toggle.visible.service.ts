import { getOptionalZodErrorMessage } from '#app/utils/misc'
import { verifyArtworkVersion } from '../artwork-version.get.server'
import { prisma } from '#app/utils/db.server'
import { IArtworkVersionLayerUpdateFieldSubmission } from './definitions.update'
import { ILayerUpdatedResponse } from '#app/models/layer/definitions.update'
import { verifyLayer } from '#app/models/layer/layer.get.server'
import { updateLayerVisible } from '#app/models/layer/layer.update.server'

export const updateArtworkVersionLayerVisibleService = async ({
	userId,
	id,
	artworkVersionId,
}: IArtworkVersionLayerUpdateFieldSubmission): Promise<ILayerUpdatedResponse> => {
	try {
		// Step 1: verify the artwork version exists
		await verifyArtworkVersion({
			where: { id: artworkVersionId, ownerId: userId },
		})

		// Step 2: verify the layer exists
		const layer = await verifyLayer({
			where: { id, artworkVersionId, ownerId: userId },
		})

		// Step 3: update the layer
		const updateLayerVisiblePromise = updateLayerVisible({
			id,
			ownerId: userId,
			visible: !layer.visible,
		})
		const [updatedLayer] = await prisma.$transaction([
			updateLayerVisiblePromise,
		])

		return {
			success: true,
			updatedLayer,
		}
	} catch (error) {
		return {
			success: false,
			message: getOptionalZodErrorMessage(error),
		}
	}
}
