import { z } from 'zod'
import { type ILinkedListNodeUpdateOrderData } from '../__shared/linked-list.definitions.update'
import { type ILayerUpdateFieldData } from './definitions.update'

export const UpdateLayerFieldSchema = z.object({
	id: z.string(),
}) satisfies z.Schema<ILayerUpdateFieldData>

export const UpdateLayerOrderSchema = z.object({
	direction: z.enum(['up', 'down']),
}) satisfies z.Schema<ILinkedListNodeUpdateOrderData>
