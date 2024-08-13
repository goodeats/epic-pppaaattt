import { type ZodType, z } from 'zod'
import { type IExampleEntityCloneData } from './entity._.clone.definitions'

export const CloneExampleEntitySchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
}) satisfies ZodType<IExampleEntityCloneData>
