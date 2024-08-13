import { type IArtworkVersion } from '#app/models/artwork-version/definitions'
import { type ILayer } from '#app/models/layer/definitions'
import {
	deselectArtworkVersionLayers,
	updateLayerSelected,
} from '#app/models/layer-artwork-version/layer-artwork-version.update.server'
import { type IUser } from '#app/models/user/user.server'
import { prisma } from '#app/utils/db.server'
import { verifyLayer } from '#app/models/layer/layer.get.server'
import { getOptionalZodErrorMessage } from '#app/utils/misc'

export const artworkVersionLayerSelectService = async ({
	userId,
	id,
	artworkVersionId,
}: {
	userId: IUser['id']
	id: ILayer['id']
	artworkVersionId: IArtworkVersion['id']
}) => {
	try {
		const promises = []
		// Step 1: get the layer
		const layer = await verifyLayer({ where: { id, ownerId: userId } })
		const { selected } = layer

		// Step 2: deselect all layers in the artwork version
		const deselectLayersPromise = deselectArtworkVersionLayers({
			artworkVersionId,
		})
		promises.push(deselectLayersPromise)

		// Step 3: select the layer if currently not selected
		if (!selected) {
			const selectLayerPromise = updateLayerSelected({
				id,
				selected: !selected,
			})
			promises.push(selectLayerPromise)
		}

		await prisma.$transaction(promises)

		return { success: true }
	} catch (error) {
		return {
			success: false,
			message: getOptionalZodErrorMessage(error),
		}
	}
}
