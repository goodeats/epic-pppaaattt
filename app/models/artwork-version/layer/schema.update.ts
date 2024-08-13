import { ZodType } from 'zod'
import { ArtworkVersionParentSchema } from '../schema'
import {
	IArtworkVersionLayerUpdateFieldData,
	IArtworkVersionLayerUpdateOrderData,
} from './definitions.update'
import {
	UpdateLayerFieldSchema,
	UpdateLayerOrderSchema,
} from '#app/models/layer/schema.update'

export const UpdateArtworkVersionLayerFieldSchema =
	UpdateLayerFieldSchema.merge(
		ArtworkVersionParentSchema,
	) satisfies ZodType<IArtworkVersionLayerUpdateFieldData>

export const UpdateArtworkVersionLayerReorderSchema =
	UpdateArtworkVersionLayerFieldSchema.merge(
		UpdateLayerOrderSchema,
	) satisfies ZodType<IArtworkVersionLayerUpdateOrderData>
