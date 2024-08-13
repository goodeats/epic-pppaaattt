import { IDesign, designTypeEnum } from '#app/models/design/definitions'
import {
	updateDesignFields,
	updateDesignSelected,
} from '#app/models/design/design.update.server'
import { IArtworkVersion } from '../definitions'

export const updateArtworkVersionDesignsDeselected = ({
	artworkVersionId,
	type,
}: {
	artworkVersionId: IArtworkVersion['id']
	type: designTypeEnum
}) => {
	return updateDesignFields({
		where: { artworkVersionId, type, selected: true },
		data: { selected: false },
	})
}

export const updateArtworkVersionDesignSelected = ({
	id,
}: {
	id: IArtworkVersion['id']
}) => {
	return updateDesignSelected({
		id,
		selected: true,
	})
}

export const updateArtworkVersionSelectedDesign = ({
	artworkVersionId,
	designId,
	type,
}: {
	artworkVersionId: IArtworkVersion['id']
	designId: IDesign['id']
	type: designTypeEnum
}) => {
	const deselectDesignsPromise = updateArtworkVersionDesignsDeselected({
		artworkVersionId,
		type,
	})
	const selectDesignPromise = updateArtworkVersionDesignSelected({
		id: designId,
	})
	return [deselectDesignsPromise, selectDesignPromise]
}
