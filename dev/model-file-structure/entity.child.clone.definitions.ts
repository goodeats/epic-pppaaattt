import {
	type IExampleEntityParentData,
	type IExampleEntitySubmission,
} from './entity._._definitions'
import { type IExampleEntityCloneData } from './entity._.clone.definitions'

export interface IExampleEntityExampleChildCloneData
	extends IExampleEntityCloneData,
		IExampleEntityParentData {}

export interface IExampleEntityExampleChildCloneSubmission
	extends IExampleEntityExampleChildCloneData,
		IExampleEntitySubmission {
	// IExampleEntitySubmission here is from the child entity's own entity-level definitions file
	name: string
	description: string
}
