import { IDesign, designTypeEnum } from '#app/models/design/definitions'
import {
	updateDesignFields,
	updateDesignSelected,
} from '#app/models/design/design.update.server'
import { ILayer } from './definitions'

export const updateLayerDesignsDeselected = ({
	layerId,
	type,
}: {
	layerId: ILayer['id']
	type: designTypeEnum
}) => {
	return updateDesignFields({
		where: { layerId, type, selected: true },
		data: { selected: false },
	})
}

export const updateLayerDesignSelected = ({ id }: { id: ILayer['id'] }) => {
	return updateDesignSelected({
		id,
		selected: true,
	})
}

export const updateLayerSelectedDesign = ({
	layerId,
	designId,
	type,
}: {
	layerId: ILayer['id']
	designId: IDesign['id']
	type: designTypeEnum
}) => {
	const deselectDesignsPromise = updateLayerDesignsDeselected({
		layerId,
		type,
	})
	const selectDesignPromise = updateLayerDesignSelected({
		id: designId,
	})
	return [deselectDesignsPromise, selectDesignPromise]
}
