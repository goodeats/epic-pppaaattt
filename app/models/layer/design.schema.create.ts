import { type ZodType } from 'zod'
import { NewDesignSchema } from '#app/models/design/schema.create'
import { LayerParentSchema } from '#app/schema/asset/image.layer'
import { ILayerDesignNewData } from './design.definitions.create'

export const NewLayerDesignSchema = NewDesignSchema.merge(
	LayerParentSchema,
) satisfies ZodType<ILayerDesignNewData>
