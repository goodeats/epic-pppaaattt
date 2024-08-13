import { type ICreatedResponse } from '#app/definitions/intent-action-args'
import { type IUser } from '#app/models/user/user.server.js'
import {
	type IExampleEntity,
	type IExampleEntityData,
} from './entity._._definitions'
import { type IExampleEntityExampleChildCreateData } from './entity.child.create.definitions'

export interface IExampleEntityNewData {
	// type: entityTypeEnum
}

export interface IExampleEntityCreateData extends IExampleEntityData {
	ownerId: IUser['id']
	// type: entityTypeEnum
	// any other model attributes that have no default values or override them
}

export type IExampleEntityParentCreateData =
	IExampleEntityExampleChildCreateData
// add more parent models here

export interface IExampleEntityCreatedResponse extends ICreatedResponse {
	createdExampleEntity?: IExampleEntity
}
