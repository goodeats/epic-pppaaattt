import { type PrismaPromise } from '@prisma/client'
import { LinkedListNodeTypeEnum } from '#app/models/__shared/linked-list.definitions'
import { connectUnlinkedNodes } from '#app/models/__shared/linked-list.node.update.server.js'
import { type IDesignsClonedResponse } from '#app/models/design/definitions.clone'
import {
	type ILayer,
	type ILayerWithChildren,
} from '#app/models/layer/definitions'
import { cloneDesignsToLayerService } from '#app/models/layer/design.clone.service'
import { createLayer } from '#app/models/layer/layer.create.server'
import { type IUser } from '#app/models/user/user.server'
import { prisma } from '#app/utils/db.server'
import { getOptionalZodErrorMessage } from '#app/utils/misc'
import { type IArtworkVersion } from '../definitions'
import { type IArtworkVersionLayerCloneSubmission } from './definitions.clone'
import { type IArtworkVersionLayerCreateData } from './definitions.create'
import { ArtworkVersionLayerSchema } from './schema'

export const cloneLayersToArtworkVersionService = async ({
	userId,
	artworkVersionId,
	layers,
}: IArtworkVersionLayerCloneSubmission): Promise<IDesignsClonedResponse> => {
	try {
		// Step 2: Prepare layer create data
		const validatedLayerCreateDataList = prepareLayerCreateData({
			layers,
			userId,
			artworkVersionId,
		})

		// Step 3: Create cloned layers in order
		const cloneLayerPromises = prepareLayerCreatePromises({
			validatedLayerCreateDataList,
		})
		// Step 4: Execute transaction
		const clonedLayers = await prisma.$transaction(cloneLayerPromises)

		// Step 5: Prepare layer update promises
		// re-link the cloned layers
		const updateLayerPromises = connectUnlinkedNodes({
			items: clonedLayers,
			type: LinkedListNodeTypeEnum.LAYER,
		})
		// Step 6: Execute transaction
		await prisma.$transaction(updateLayerPromises)

		// Step 7: clone layer designs to cloned layer
		await cloneDesignsToLayers({
			userId,
			layers,
			clonedLayers,
		})

		// TODO: clone assets too

		return { success: true }
	} catch (error) {
		return {
			success: false,
			message: getOptionalZodErrorMessage(error),
		}
	}
}

const validateLayerData = ({
	layer,
	userId,
	artworkVersionId,
}: {
	layer: ILayerWithChildren
	userId: IUser['id']
	artworkVersionId: IArtworkVersion['id']
}): IArtworkVersionLayerCreateData => {
	// Step 1: build the layer data
	const { name, description, visible, selected } = layer
	const layerData = {
		name,
		description,
		visible,
		selected,
		ownerId: userId,
		artworkVersionId,
	}
	// Step 2: validate the layer data with the schema
	return ArtworkVersionLayerSchema.parse(layerData)
}

const prepareLayerCreateData = ({
	layers,
	userId,
	artworkVersionId,
}: {
	layers: ILayerWithChildren[]
	userId: IUser['id']
	artworkVersionId: IArtworkVersion['id']
}): IArtworkVersionLayerCreateData[] => {
	return layers.map((layer) =>
		validateLayerData({
			layer,
			userId,
			artworkVersionId,
		}),
	)
}

const prepareLayerCreatePromises = ({
	validatedLayerCreateDataList,
}: {
	validatedLayerCreateDataList: IArtworkVersionLayerCreateData[]
}): PrismaPromise<ILayer>[] => {
	const cloneLayerPromises = []
	// Step 1: iterate through the validated layer create data list
	for (const data of validatedLayerCreateDataList) {
		// Step 2: create the layer promise
		const createdLayerPromise = createLayer({ data })
		cloneLayerPromises.push(createdLayerPromise)
	}
	return cloneLayerPromises
}

const cloneDesignsToLayers = async ({
	userId,
	layers,
	clonedLayers,
}: {
	userId: IUser['id']
	layers: ILayerWithChildren[]
	clonedLayers: ILayer[]
}) => {
	// Step 1: iterate through the layers
	for (let i = 0; i < layers.length; i++) {
		const layer = layers[i]!
		const clonedLayer = clonedLayers[i]!
		// Step 2: get designs from the layer
		const designs = layer.designs
		// Step 3: clone the designs to the cloned layer
		await cloneDesignsToLayerService({
			userId,
			layerId: clonedLayer.id,
			designs,
		})
	}
}
