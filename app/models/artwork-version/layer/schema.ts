import { type ZodType } from 'zod'
import { LayerDataSchema } from '#app/models/layer/schema'
import { ArtworkVersionParentSchema } from '../schema'
import { type IArtworkVersionLayerCreateData } from './definitions.create'

export const ArtworkVersionLayerSchema: ZodType<IArtworkVersionLayerCreateData> =
	LayerDataSchema.merge(
		ArtworkVersionParentSchema,
	) as ZodType<IArtworkVersionLayerCreateData>
