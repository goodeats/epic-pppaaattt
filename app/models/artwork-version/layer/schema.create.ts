import { type ZodType } from 'zod'
import { NewLayerSchema } from '#app/models/layer/schema.create'
import { ArtworkVersionParentSchema } from '../schema'
import { type IArtworkVersionLayerNewData } from './definitions.create'

export const NewArtworkVersionLayerSchema = NewLayerSchema.merge(
	ArtworkVersionParentSchema,
) satisfies ZodType<IArtworkVersionLayerNewData>
