import { type ZodType } from 'zod'
import { ExampleEntityParentSchema } from './entity._._schema'
import { CloneExampleEntitySchema } from './entity._.clone.schema'
import { type IExampleEntityExampleChildCloneData } from './entity.child.clone.definitions'

export const CloneExampleEntityExampleChildSchema =
	CloneExampleEntitySchema.merge(
		ExampleEntityParentSchema,
	) satisfies ZodType<IExampleEntityExampleChildCloneData>
