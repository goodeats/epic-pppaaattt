import { type IDesign, type designTypeEnum } from '#app/models/design/definitions'
import { type IUpdateSelectedDesignStrategy } from '#app/strategies/design/update-selected.strategy'
import { prisma } from '#app/utils/db.server'
import { type ILayer } from './definitions'
import { getFirstLayerOrderedDesignsVisible } from './design.get.server'
import {
	updateLayerDesignsDeselected,
	updateLayerSelectedDesign,
} from './design.update.server'

export class UpdateLayerSelectedDesignStrategy
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
		const updateSelectedDesignPromises = updateLayerSelectedDesign({
			layerId: targetEntityId,
			designId,
			type,
		})
		await prisma.$transaction(updateSelectedDesignPromises)
	}

	async findFirstVisibleDesign({
		targetEntityId,
		type,
	}: {
		targetEntityId: ILayer['id']
		type: designTypeEnum
	}) {
		return getFirstLayerOrderedDesignsVisible({
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
		const deselectDesignsPromise = updateLayerDesignsDeselected({
			layerId: targetEntityId,
			type,
		})
		await prisma.$transaction([deselectDesignsPromise])
	}
}
