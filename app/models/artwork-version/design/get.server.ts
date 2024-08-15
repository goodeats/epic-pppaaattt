import { orderLinkedItems } from '#app/models/__shared/linked-list.utils'
import { type IDesign, type designTypeEnum } from '#app/models/design/definitions'
import { getDesigns } from '#app/models/design/design.get.server'
import { type IArtworkVersion } from '../definitions'

export const getArtworkVersionDesigns = ({
	artworkVersionId,
	type,
}: {
	artworkVersionId: IArtworkVersion['id']
	type: designTypeEnum
}): Promise<IDesign[]> => {
	return getDesigns({
		where: { artworkVersionId, type },
	})
}

export const getOrderedArtworkVersionDesigns = async ({
	artworkVersionId,
	type,
}: {
	artworkVersionId: IArtworkVersion['id']
	type: designTypeEnum
}): Promise<IDesign[]> => {
	const designs = await getArtworkVersionDesigns({
		artworkVersionId,
		type,
	})
	return orderLinkedItems<IDesign>(designs)
}

export const getFirstArtworkVersionOrderedDesignsVisible = async ({
	artworkVersionId,
	type,
}: {
	artworkVersionId: IArtworkVersion['id']
	type: designTypeEnum
}): Promise<IDesign | null> => {
	const orderedDesigns = await getOrderedArtworkVersionDesigns({
		artworkVersionId,
		type,
	})
	return orderedDesigns.find(design => design.visible) || null
}
