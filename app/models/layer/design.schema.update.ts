import { type ZodType } from 'zod'
import {
	UpdateDesignFieldSchema,
	UpdateDesignOrderSchema,
} from '#app/models/design/schema.update'
import { LayerParentSchema } from '#app/schema/asset/image.layer'
import {
	type ILayerDesignUpdateFieldData,
	type ILayerDesignUpdateOrderData,
} from './design.definitions.update'

export const UpdateLayerDesignFieldSchema = UpdateDesignFieldSchema.merge(
	LayerParentSchema,
) satisfies ZodType<ILayerDesignUpdateFieldData>

export const UpdateLayerDesignReorderSchema =
	UpdateLayerDesignFieldSchema.merge(
		UpdateDesignOrderSchema,
	) satisfies ZodType<ILayerDesignUpdateOrderData>
