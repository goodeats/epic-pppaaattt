import { type IArtworkVersion } from '#app/models/artwork-version/definitions'
import { ILayer } from '#app/models/layer/definitions'
import {
	deleteLayer,
	type ILayerDeletedResponse,
} from '#app/models/layer/layer.delete.server'
import { verifyLayer } from '#app/models/layer/layer.get.server'
import {
	connectPrevAndNextLayers,
	updateLayerToHead,
	updateLayerToTail,
} from '#app/models/layer/layer.update.linked-list.server'
import { type IUser } from '#app/models/user/user.server'
import { prisma } from '#app/utils/db.server'
import { getOptionalZodErrorMessage } from '#app/utils/misc'

// TODO: move logic to direct layer service
export const artworkVersionLayerDeleteService = async ({
	userId,
	id,
	artworkVersionId,
}: {
	userId: IUser['id']
	id: ILayer['id']
	artworkVersionId: IArtworkVersion['id']
}): Promise<ILayerDeletedResponse> => {
	try {
		// Step 1: get the layer
		const layer = await verifyLayer({
			where: {
				id,
				ownerId: userId,
			},
		})
		const { nextId, prevId } = layer

		// Step 2: get next and previous layers
		const { nextLayer, prevLayer } = await getAdjacentLayers({
			userId,
			layer,
		})

		// Step 3: delete layer
		const deleteLayerPromise = deleteLayer({ id })

		// Step 4: update next/prev layers if they exist
		const updateLayerNodesPromises = updateLayerNodes({
			nextId,
			nextLayer,
			prevId,
			prevLayer,
		})

		await prisma.$transaction([deleteLayerPromise, ...updateLayerNodesPromises])

		return { success: true }
	} catch (error) {
		return {
			success: false,
			message: getOptionalZodErrorMessage(error),
		}
	}
}

const getAdjacentLayers = async ({
	userId,
	layer,
}: {
	userId: IUser['id']
	layer: ILayer
}) => {
	const { nextId, prevId } = layer

	const nextLayer = nextId
		? await verifyLayer({
				where: {
					id: nextId,
					ownerId: userId,
				},
			})
		: null

	const prevLayer = prevId
		? await verifyLayer({
				where: {
					id: prevId,
					ownerId: userId,
				},
			})
		: null

	return { nextLayer, prevLayer }
}

// maintain linked list integrity
const updateLayerNodes = ({
	nextId,
	nextLayer,
	prevId,
	prevLayer,
}: {
	nextId: string | null
	nextLayer: ILayer | null
	prevId: string | null
	prevLayer: ILayer | null
}) => {
	const updateLayerNodesPromises = []

	if (!prevId && nextId && nextLayer) {
		// If head, remove prevId from next layer, becomes head
		const nextLayerToHeadPromise = updateLayerToHead({ id: nextId })
		updateLayerNodesPromises.push(nextLayerToHeadPromise)
	} else if (!nextId && prevId && prevLayer) {
		// If tail, remove nextId from prev layer, becomes tail
		const prevLayerToTailPromise = updateLayerToTail({ id: prevId })
		updateLayerNodesPromises.push(prevLayerToTailPromise)
	} else if (prevId && nextId && prevLayer && nextLayer) {
		// If in middle, connect prev and next layers directly
		const connectLayersPromise = connectPrevAndNextLayers({
			prevId,
			nextId,
		})

		updateLayerNodesPromises.push(...connectLayersPromise)
	}

	return updateLayerNodesPromises
}
