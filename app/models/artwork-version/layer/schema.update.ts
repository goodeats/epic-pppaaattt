import { type ZodType } from 'zod'
import {
	UpdateLayerFieldSchema,
	UpdateLayerOrderSchema,
} from '#app/models/layer/schema.update'
import { ArtworkVersionParentSchema } from '../schema'
import {
	type IArtworkVersionLayerUpdateFieldData,
	type IArtworkVersionLayerUpdateOrderData,
} from './definitions.update'

export const UpdateArtworkVersionLayerFieldSchema =
	UpdateLayerFieldSchema.merge(
		ArtworkVersionParentSchema,
	) satisfies ZodType<IArtworkVersionLayerUpdateFieldData>

export const UpdateArtworkVersionLayerReorderSchema =
	UpdateArtworkVersionLayerFieldSchema.merge(
		UpdateLayerOrderSchema,
	) satisfies ZodType<IArtworkVersionLayerUpdateOrderData>
