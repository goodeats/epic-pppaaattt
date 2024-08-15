import { type ZodType, z } from 'zod'
import {
	type IExampleEntityData,
	type IExampleEntityParentData,
} from './entity._._definitions'

export const ExampleEntityDataSchema = z.object({
	name: z.string(),
	description: z.string().nullable(),
	visible: z.boolean(),
	ownerId: z.string(),
}) satisfies z.Schema<IExampleEntityData>

export const ExampleEntityParentSchema = z.object({
	exampleEntityId: z.string(),
}) satisfies ZodType<IExampleEntityParentData>
