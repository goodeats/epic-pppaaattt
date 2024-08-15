import { z } from 'zod'
import { type ILayerData } from './definitions'

export const LayerDataSchema = z.object({
	name: z.string(),
	description: z.string().nullable().optional(),
	slug: z.string().optional(),
	visible: z.boolean(),
	selected: z.boolean(),
	ownerId: z.string(),
}) satisfies z.Schema<ILayerData>
