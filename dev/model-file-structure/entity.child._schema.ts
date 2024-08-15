import { type ZodType } from 'zod'
import {
	ExampleEntityDataSchema,
	ExampleEntityParentSchema,
} from './entity._._schema'
import { type IExampleEntityExampleChildCreateData } from './entity.child.create.definitions'

export const ExampleEntityExampleChildSchema: ZodType<IExampleEntityExampleChildCreateData> =
	ExampleEntityDataSchema.merge(
		ExampleEntityParentSchema,
	) as ZodType<IExampleEntityExampleChildCreateData>
