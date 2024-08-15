import { type ZodType } from 'zod'
import { DesignFillDataSchema } from '#app/models/design/fill/schema'
import { LayerParentSchema } from '#app/schema/asset/image.layer'
import { type ILayerDesignFillCreateData } from './design.definitions.create'

export const LayerDesignFillSchema: ZodType<ILayerDesignFillCreateData> =
	DesignFillDataSchema.merge(
		LayerParentSchema,
	) as ZodType<ILayerDesignFillCreateData>
