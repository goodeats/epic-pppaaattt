import { type ZodType } from 'zod'
import { DesignFillDataSchema } from '#app/models/design/fill/schema'
import { ArtworkVersionParentSchema } from '../schema'
import { type IArtworkVersionDesignFillCreateData } from './definitions.create'

export const ArtworkVersionDesignFillSchema: ZodType<IArtworkVersionDesignFillCreateData> =
	DesignFillDataSchema.merge(
		ArtworkVersionParentSchema,
	) as ZodType<IArtworkVersionDesignFillCreateData>
