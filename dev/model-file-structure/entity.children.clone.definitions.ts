import { type IClonedResponse } from '#app/definitions/intent-action-args.js'
import { type IUser } from '#app/models/user/user.server.js'
import {
	type IExampleEntityWithChildren,
	type IExampleEntity,
} from './entity._._definitions'

export interface IExampleEntityChildrenCloneSubmission {
	userId: IUser['id']
	exampleEntityId: IExampleEntity['id']
	// want children with their children
	// so cloning is recursive down the tree
	children: IExampleEntity[] | IExampleEntityWithChildren[]
}

export interface IExampleEntitiesClonedResponse extends IClonedResponse {}
