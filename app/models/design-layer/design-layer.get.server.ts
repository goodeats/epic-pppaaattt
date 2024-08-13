import { designTypeEnum } from '#app/models/design/definitions'
import { prisma } from '#app/utils/db.server'
import { orderLinkedItems } from '../__shared/linked-list.utils'
import { type IDesign } from '../design/definitions'
import { type ILayer } from '../layer/definitions'

export const findFirstVisibleLayerDesignByType = async ({
	layerId,
	type,
}: {
	layerId: ILayer['id']
	type: designTypeEnum
}): Promise<IDesign | null> => {
	const designs = await prisma.design.findMany({
		where: { layerId, type },
	})
	const orderedDesigns = orderLinkedItems<IDesign>(designs)
	return orderedDesigns.find(design => design.visible) || null
}
