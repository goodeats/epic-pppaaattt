import { type ZodType } from 'zod'
import { DesignFillDataSchema } from '#app/models/design/fill/schema'
import { ILayerDesignFillCreateData } from './design.definitions.create'
import { LayerParentSchema } from '#app/schema/asset/image.layer'

export const LayerDesignFillSchema: ZodType<ILayerDesignFillCreateData> =
	DesignFillDataSchema.merge(
		LayerParentSchema,
	) as ZodType<ILayerDesignFillCreateData>
