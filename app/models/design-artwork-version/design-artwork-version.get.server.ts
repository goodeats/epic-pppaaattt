import { designTypeEnum } from '#app/models/design/definitions'
import { prisma } from '#app/utils/db.server'
import { orderLinkedItems } from '../__shared/linked-list.utils'
import { type IArtworkVersion } from '../artwork-version/definitions'
import { type IDesign } from '../design/definitions'

export const findFirstVisibleArtworkVersionDesignByType = async ({
	artworkVersionId,
	type,
}: {
	artworkVersionId: IArtworkVersion['id']
	type: designTypeEnum
}): Promise<IDesign | null> => {
	const designs = await prisma.design.findMany({
		where: { artworkVersionId, type },
	})
	const orderedDesigns = orderLinkedItems<IDesign>(designs)
	return orderedDesigns.find(design => design.visible) || null
}
