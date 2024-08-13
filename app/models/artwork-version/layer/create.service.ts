import { LinkedListNodeTypeEnum } from '#app/models/__shared/linked-list.definitions'
import { connectNodes } from '#app/models/__shared/linked-list.node.update.server'
import { type IDesignsClonedResponse } from '#app/models/design/definitions.clone'
import { findManyDesignsWithType } from '#app/models/design/design.get.server'
import { type ILayer } from '#app/models/layer/definitions'
import { type ILayerCreatedResponse } from '#app/models/layer/definitions.create'
import { cloneDesignsToLayerService } from '#app/models/layer/design.clone.service'
import { createLayer } from '#app/models/layer/layer.create.server'
import { getLayer, getLayersCount } from '#app/models/layer/layer.get.server'
import { type IUser } from '#app/models/user/user.server'
import { prisma } from '#app/utils/db.server'
import { getOptionalZodErrorMessage } from '#app/utils/misc'
import { verifyArtworkVersion } from '../artwork-version.get.server'
import { type IArtworkVersion } from '../definitions'
import { IArtworkVersionLayerCreateSubmission } from './definitions.create'
import { ArtworkVersionLayerSchema } from './schema'

export const createArtworkVersionLayerService = async ({
	userId,
	artworkVersionId,
	cloneDesigns = true,
}: IArtworkVersionLayerCreateSubmission): Promise<ILayerCreatedResponse> => {
	try {
		// Step 1: verify the artwork version exists
		await verifyArtworkVersion({
			where: { id: artworkVersionId, ownerId: userId },
		})

		// Step 2: set layer name
		const name = await createLayerNameDefault({
			artworkVersionId,
		})

		// Step 3: validate layer data
		const layerData = {
			name,
			ownerId: userId,
			artworkVersionId,
			visible: true,
			selected: false,
		}
		const validatedLayerData = ArtworkVersionLayerSchema.parse(layerData)

		// Step 4: find existing linked list tail (before creating new tail)
		const getTailPromise = getLayer({
			where: { artworkVersionId, nextId: null },
		})

		// Step 5: create the layer via promise
		const createLayerPromise = createLayer({
			data: { ...validatedLayerData },
		})

		// Step 6: execute the transactions
		const [prevTail, createdLayer] = await prisma.$transaction([
			getTailPromise,
			createLayerPromise,
		])

		// Step 7: connect new layer to tail layer, if it exists
		if (prevTail) {
			const connectDesignsPromise = connectNodes({
				type: LinkedListNodeTypeEnum.LAYER,
				prevId: prevTail.id,
				nextId: createdLayer.id,
			})
			await prisma.$transaction(connectDesignsPromise)
		}

		// Step 8: clone designs from artwork version
		if (cloneDesigns) {
			await cloneDesignsToLayer({
				userId,
				artworkVersionId,
				layerId: createdLayer.id,
			})
		}

		return {
			createdLayer,
			success: true,
		}
	} catch (error) {
		return {
			success: false,
			message: getOptionalZodErrorMessage(error),
		}
	}
}

const createLayerNameDefault = async ({
	artworkVersionId,
}: {
	artworkVersionId: IArtworkVersion['id']
}): Promise<string> => {
	const layersCount = await getLayersCount({
		where: { artworkVersionId },
	})
	return `Layer ${layersCount + 1}`
}

const cloneDesignsToLayer = async ({
	userId,
	artworkVersionId,
	layerId,
}: {
	userId: IUser['id']
	artworkVersionId: IArtworkVersion['id']
	layerId: ILayer['id']
}): Promise<IDesignsClonedResponse> => {
	const designs = await findManyDesignsWithType({
		where: { artworkVersionId },
	})
	return await cloneDesignsToLayerService({
		userId,
		layerId,
		designs,
	})
}
