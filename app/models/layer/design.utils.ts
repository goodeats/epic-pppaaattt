import { DesignTypeEnum, type designTypeEnum } from '../design/definitions'
import { LayerDesignFillSchema } from './design.schema'

export const findLayerDesignSchemaByType = ({
	type,
}: {
	type: designTypeEnum
}) => {
	switch (type) {
		case DesignTypeEnum.FILL:
			return LayerDesignFillSchema
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
