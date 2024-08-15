import { type ZodType, z } from 'zod'
import {
	type IArtworkBranchData,
	type IArtworkBranchParentData,
} from './_._definitions'

export const ArtworkVersionDataSchema = z.object({
	name: z.string(),
	slug: z.string(),
	description: z.string(),
	ownerId: z.string(),
	parentId: z.string().optional(),
}) satisfies z.Schema<IArtworkBranchData>

export const ArtworkBranchParentSchema = z.object({
	branchId: z.string(),
}) satisfies ZodType<IArtworkBranchParentData>
