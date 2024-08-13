import { type ZodType } from 'zod'
import { ArtworkVersionParentSchema } from '../schema'
import { NewLayerSchema } from '#app/models/layer/schema.create'
import { IArtworkVersionLayerNewData } from './definitions.create'

export const NewArtworkVersionLayerSchema = NewLayerSchema.merge(
	ArtworkVersionParentSchema,
) satisfies ZodType<IArtworkVersionLayerNewData>
