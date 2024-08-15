import { type IDesignSubmission } from '#app/models/design/definitions.js'
import { type IExampleEntityParentData } from './entity._._definitions'
import {
	type IExampleEntityCreateData,
	type IExampleEntityNewData,
} from './entity._.create.definitions'

export interface IExampleEntityExampleChildNewData
	extends IExampleEntityNewData,
		IExampleEntityParentData {}

export interface IExampleEntityExampleChildCreateSubmission
	extends IExampleEntityExampleChildNewData,
		IDesignSubmission {}

// if entity has enum type
// export interface IExampleEntityExampleChildTypeCreateData
// 	extends IExampleChildTypeCreateData,
// 		IExampleEntityParentData {}

// export type IExampleEntityExampleChildCreateData =
// IExampleEntityExampleChildTypeCreateData

export interface IExampleEntityExampleChildCreateData
	extends IExampleEntityCreateData,
		IExampleEntityParentData {}
