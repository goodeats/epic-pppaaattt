import {
	UpdateDesignFieldSchema,
	UpdateDesignOrderSchema,
} from '#app/models/design/schema.update'
import { ZodType } from 'zod'
import { ArtworkVersionParentSchema } from '../schema'
import {
	IArtworkVersionDesignUpdateFieldData,
	IArtworkVersionDesignUpdateOrderData,
} from './definitions.update'

export const UpdateArtworkVersionDesignFieldSchema =
	UpdateDesignFieldSchema.merge(
		ArtworkVersionParentSchema,
	) satisfies ZodType<IArtworkVersionDesignUpdateFieldData>

export const UpdateArtworkVersionDesignReorderSchema =
	UpdateArtworkVersionDesignFieldSchema.merge(
		UpdateDesignOrderSchema,
	) satisfies ZodType<IArtworkVersionDesignUpdateOrderData>
