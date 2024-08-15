import { DeleteDesignSchema } from '#app/models/design/schema.delete'
import { ArtworkVersionParentSchema } from '../schema'

export const DeleteArtworkVersionDesignSchema = DeleteDesignSchema.merge(
	ArtworkVersionParentSchema,
)
