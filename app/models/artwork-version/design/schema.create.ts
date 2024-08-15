import { type ZodType } from 'zod'
import { NewDesignSchema } from '#app/models/design/schema.create'
import { ArtworkVersionParentSchema } from '../schema'
import { type IArtworkVersionDesignNewData } from './definitions.create'

export const NewArtworkVersionDesignSchema = NewDesignSchema.merge(
	ArtworkVersionParentSchema,
) satisfies ZodType<IArtworkVersionDesignNewData>
