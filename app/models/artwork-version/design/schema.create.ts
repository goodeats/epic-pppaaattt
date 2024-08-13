import { type ZodType } from 'zod'
import { ArtworkVersionParentSchema } from '../schema'
import { NewDesignSchema } from '#app/models/design/schema.create'
import { IArtworkVersionDesignNewData } from './definitions.create'

export const NewArtworkVersionDesignSchema = NewDesignSchema.merge(
	ArtworkVersionParentSchema,
) satisfies ZodType<IArtworkVersionDesignNewData>
