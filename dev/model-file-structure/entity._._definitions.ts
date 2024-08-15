import { type DateOrString } from '#app/definitions/prisma-helper'
import { type ISubmission } from '#app/definitions/submission.js'
import { type IUser } from '#app/models/user/user.server.js'

// mock-up of a prisma model
export type ExampleEntity = {
	id: string
	name: string
	description: string | null
	visible: boolean
	ownerId: IUser['id']
	exampleEntityId: ExampleEntity['id'] | null
}

// Omitting 'createdAt' and 'updatedAt' from the ExampleEntity interface
// prisma query returns a string for these fields
type BaseExampleEntity = Omit<
	ExampleEntity,
	'createdAt' | 'updatedAt' // | 'publishedAt'
>

export interface IExampleEntity extends BaseExampleEntity {
	createdAt: DateOrString
	updatedAt: DateOrString
	// any other potential datetime fields
	// publishedAt: DateOrString | null
}

// children are different type of entity prisma model
// has many children relationship
export interface IExampleEntityWithChildren extends IExampleEntity {
	children: IExampleEntity[]
	children2: IExampleEntity[]
}

// parent is a different type of entity prisma model
// belongs to parent relationship
export interface IExampleEntityWithParent extends IExampleEntity {
	parent?: IExampleEntity
	parent2?: IExampleEntity
}

// expected data for creating a new entity
// include optional property for fields that are optional in the database or have default a default value
export interface IExampleEntityData {
	name: string
	description?: string | null // optional nullable string
	visible?: boolean // optional with default value
}

export interface IExampleEntitySubmission
	extends IExampleEntityData,
		ISubmission {}

export interface IExampleEntityParentData {
	exampleEntityId: IExampleEntity['id']
}
