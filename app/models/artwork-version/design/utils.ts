import { DesignTypeEnum, designTypeEnum } from '#app/models/design/definitions'
import { ArtworkVersionDesignFillSchema } from './schema'

export const findArtworkVersionDesignSchemaByType = ({
	type,
}: {
	type: designTypeEnum
}) => {
	switch (type) {
		case DesignTypeEnum.FILL:
			return ArtworkVersionDesignFillSchema
		case DesignTypeEnum.LAYOUT:
		case DesignTypeEnum.LINE:
		case DesignTypeEnum.PALETTE:
		case DesignTypeEnum.ROTATE:
		case DesignTypeEnum.SIZE:
		case DesignTypeEnum.STROKE:
		case DesignTypeEnum.TEMPLATE:
		default:
			throw new Error(`Unsupported design type: ${type}`)
	}
}
