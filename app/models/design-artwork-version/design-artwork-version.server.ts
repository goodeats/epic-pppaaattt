import { orderLinkedItems } from '../__shared/linked-list.utils'
import { type IArtworkVersion } from '../artwork-version/definitions'
import {
	type IDesignParsed,
	type IDesign,
	DesignTypeEnum,
} from '../design/definitions'
import { findManyDesignsWithType } from '../design/design.get.server'
import { type IDesignPalette } from '../design/palette/palette.server'
import { type IDesignRotate } from '../design/rotate/rotate.server'
import { filterDesignsVisible } from '../design/utils'

export interface IDesignWithArtworkVersion extends IDesign {
	artworkVersion: IArtworkVersion
}

export const getArtworkVersionVisiblePalettes = async ({
	artworkVersionId,
}: {
	artworkVersionId: IArtworkVersion['id']
}): Promise<IDesignPalette[]> => {
	const designPalettes = (await findManyDesignsWithType({
		where: { type: DesignTypeEnum.PALETTE, artworkVersionId },
	})) as IDesignParsed[]

	const orderedPalettes = orderLinkedItems<IDesignParsed>(designPalettes)

	const visibleDesignPalettes = filterDesignsVisible({
		designs: orderedPalettes,
	}) as IDesignPalette[]

	return visibleDesignPalettes
}

export const getArtworkVersionVisibleRotates = async ({
	artworkVersionId,
}: {
	artworkVersionId: IArtworkVersion['id']
}): Promise<IDesignRotate[]> => {
	const designRotates = (await findManyDesignsWithType({
		where: { type: DesignTypeEnum.ROTATE, artworkVersionId },
	})) as IDesignParsed[]

	const orderedRotates = orderLinkedItems<IDesignParsed>(designRotates)

	const visibleDesignRotates = filterDesignsVisible({
		designs: orderedRotates,
	}) as IDesignRotate[]

	return visibleDesignRotates
}
