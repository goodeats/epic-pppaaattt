import { type ZodType } from 'zod'
import {
	UpdateDesignFieldSchema,
	UpdateDesignOrderSchema,
} from '#app/models/design/schema.update'
import { ArtworkVersionParentSchema } from '../schema'
import {
	type IArtworkVersionDesignUpdateFieldData,
	type IArtworkVersionDesignUpdateOrderData,
} from './definitions.update'

export const UpdateArtworkVersionDesignFieldSchema =
	UpdateDesignFieldSchema.merge(
		ArtworkVersionParentSchema,
	) satisfies ZodType<IArtworkVersionDesignUpdateFieldData>

export const UpdateArtworkVersionDesignReorderSchema =
	UpdateArtworkVersionDesignFieldSchema.merge(
		UpdateDesignOrderSchema,
	) satisfies ZodType<IArtworkVersionDesignUpdateOrderData>
