import { type ILayer } from './definitions'
import { updateLayerFields } from './layer.update.server'

export const connectPrevAndNextLayers = ({
	prevId,
	nextId,
}: {
	prevId: ILayer['id']
	nextId: ILayer['id']
}) => {
	const connectNextToPrev = updateLayerFields({
		where: { id: prevId },
		data: { nextId },
	})
	const connectPrevToNext = updateLayerFields({
		where: { id: nextId },
		data: { prevId },
	})
	return [connectNextToPrev, connectPrevToNext]
}

export const updateLayerToHead = ({ id }: { id: ILayer['id'] }) => {
	return updateLayerFields({
		where: { id },
		data: { prevId: null },
	})
}

export const updateLayerToTail = ({ id }: { id: ILayer['id'] }) => {
	return updateLayerFields({
		where: { id },
		data: { nextId: null },
	})
}

export const updateLayerRemoveNodes = ({ id }: { id: ILayer['id'] }) => {
	return updateLayerFields({
		where: { id },
		data: { prevId: null, nextId: null },
	})
}

export const updateLayerNodes = ({
	id,
	nextId,
	prevId,
}: {
	id: string
	nextId: string | null
	prevId: string | null
}) => {
	return updateLayerFields({
		where: { id },
		data: { prevId, nextId },
	})
}
