import { z } from 'zod'
import { type IDesignData } from './definitions'

export const DesignDataSchema = z.object({
	visible: z.boolean(),
	selected: z.boolean(),
	ownerId: z.string(),
}) satisfies z.Schema<IDesignData>
