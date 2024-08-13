import { type ZodType, z } from 'zod'
import { type IArtworkBranchParentData } from './_._definitions'

export const ArtworkBranchParentSchema = z.object({
	branchId: z.string(),
}) satisfies ZodType<IArtworkBranchParentData>
