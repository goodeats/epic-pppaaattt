import { IDesign, designTypeEnum } from '#app/models/design/definitions'
import { IUpdateSelectedDesignStrategy } from '#app/strategies/design/update-selected.strategy'
import { prisma } from '#app/utils/db.server'
import { IArtworkVersion } from '../definitions'
import { getFirstArtworkVersionOrderedDesignsVisible } from './get.server'
import {
	updateArtworkVersionDesignsDeselected,
	updateArtworkVersionSelectedDesign,
} from './update.server'

export class UpdateArtworkVersionSelectedDesignStrategy
	implements IUpdateSelectedDesignStrategy
{
	async updateSelectedDesign({
		targetEntityId,
		designId,
		type,
	}: {
		targetEntityId: IArtworkVersion['id']
		designId: IDesign['id']
		type: designTypeEnum
	}) {
		const updateSelectedDesignPromises = updateArtworkVersionSelectedDesign({
			artworkVersionId: targetEntityId,
			designId,
			type,
		})
		await prisma.$transaction(updateSelectedDesignPromises)
	}

	async findFirstVisibleDesign({
		targetEntityId,
		type,
	}: {
		targetEntityId: IArtworkVersion['id']
		type: designTypeEnum
	}) {
		return getFirstArtworkVersionOrderedDesignsVisible({
			artworkVersionId: targetEntityId,
			type,
		})
	}

	async deselectDesign({
		targetEntityId,
		type,
	}: {
		targetEntityId: IArtworkVersion['id']
		type: designTypeEnum
	}) {
		const deselectDesignsPromise = updateArtworkVersionDesignsDeselected({
			artworkVersionId: targetEntityId,
			type,
		})
		await prisma.$transaction([deselectDesignsPromise])
	}
}
