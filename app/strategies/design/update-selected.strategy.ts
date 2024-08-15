import {
	type IDesign,
	type IDesignEntityId,
	type IDesignIdOrNull,
	type designTypeEnum,
} from '#app/models/design/definitions'
import { findFirstVisibleLayerDesignByType } from '#app/models/design-layer/design-layer.get.server'
import {
	deselectLayerSelectedDesign,
	updateLayerSelectedDesign,
} from '#app/models/design-layer/design-layer.server'
import { type ILayer } from '#app/models/layer/definitions'
import { prisma } from '#app/utils/db.server'

export interface IUpdateSelectedDesignStrategy {
	updateSelectedDesign(args: {
		targetEntityId: IDesignEntityId
		designId?: IDesignIdOrNull
		type: designTypeEnum
	}): Promise<void>
	findFirstVisibleDesign(args: {
		targetEntityId: IDesignEntityId
		type: designTypeEnum
	}): Promise<IDesign | null>
	deselectDesign(args: {
		targetEntityId: IDesignEntityId
		type: designTypeEnum
	}): Promise<void>
}

export class LayerUpdateSelectedDesignStrategy
	implements IUpdateSelectedDesignStrategy
{
	async updateSelectedDesign({
		targetEntityId,
		designId,
		type,
	}: {
		targetEntityId: ILayer['id']
		designId: IDesign['id']
		type: designTypeEnum
	}) {
		const updateSelectedDesignPromise = updateLayerSelectedDesign({
			layerId: targetEntityId,
			designId,
			type,
		})
		await prisma.$transaction(updateSelectedDesignPromise)
	}

	async findFirstVisibleDesign({
		targetEntityId,
		type,
	}: {
		targetEntityId: ILayer['id']
		type: designTypeEnum
	}) {
		return await findFirstVisibleLayerDesignByType({
			layerId: targetEntityId,
			type,
		})
	}

	async deselectDesign({
		targetEntityId,
		type,
	}: {
		targetEntityId: ILayer['id']
		type: designTypeEnum
	}) {
		const deselectDesignsPromise = deselectLayerSelectedDesign({
			layerId: targetEntityId,
			type,
		})
		await prisma.$transaction([deselectDesignsPromise])
	}
}
