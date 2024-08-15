import { z } from 'zod'
import { type ILinkedListNodeUpdateOrderData } from '../__shared/linked-list.definitions.update'
import { type IDesignUpdateFieldData } from './definitions.update'

export const UpdateDesignFieldSchema = z.object({
	id: z.string(),
}) satisfies z.Schema<IDesignUpdateFieldData>

export const UpdateDesignOrderSchema = z.object({
	direction: z.enum(['up', 'down']),
}) satisfies z.Schema<ILinkedListNodeUpdateOrderData>
