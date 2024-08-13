import { type ZodType, z } from 'zod'
import { type IArtworkVersionCloneData } from './_.clone.definitions'

export const CloneArtworkVersionSchema = z.object({
	id: z.string(),
	description: z.string(),
}) satisfies ZodType<IArtworkVersionCloneData>
