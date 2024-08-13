import { type ZodType, z } from 'zod'
import { type IArtworkBranchCloneData } from './_.clone.definitions'

export const CloneArtworkBranchSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
}) satisfies ZodType<IArtworkBranchCloneData>
