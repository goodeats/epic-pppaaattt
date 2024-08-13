import { type IDesign, type designTypeEnum } from '#app/models/design/definitions'
import { getDesigns } from '#app/models/design/design.get.server'
import { orderLinkedItems } from '../__shared/linked-list.utils'
import { type ILayer } from './definitions'

export const getLayerDesigns = ({
	layerId,
	type,
}: {
	layerId: ILayer['id']
	type: designTypeEnum
}): Promise<IDesign[]> => {
	return getDesigns({
		where: { layerId, type },
	})
}

export const getOrderedLayerDesigns = async ({
	layerId,
	type,
}: {
	layerId: ILayer['id']
	type: designTypeEnum
}): Promise<IDesign[]> => {
	const designs = await getLayerDesigns({
		layerId,
		type,
	})
	return orderLinkedItems<IDesign>(designs)
}

export const getFirstLayerOrderedDesignsVisible = async ({
	layerId,
	type,
}: {
	layerId: ILayer['id']
	type: designTypeEnum
}): Promise<IDesign | null> => {
	const orderedDesigns = await getOrderedLayerDesigns({
		layerId,
		type,
	})
	return orderedDesigns.find(design => design.visible) || null
}
