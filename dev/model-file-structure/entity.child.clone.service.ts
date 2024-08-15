import { invariant } from '@epic-web/invariant'
import { type IUser } from '#app/models/user/user.server'
import { getOptionalZodErrorMessage } from '#app/utils/misc'
import { type IExampleEntity } from './entity._._definitions'
import { type IExampleEntitiesClonedResponse } from './entity._.clone.definitions'
import { createExampleEntity } from './entity._.create.db.server'
import { type IExampleEntityCreatedResponse } from './entity._.create.definitions'
import {
	getExampleEntityWithChildren,
	verifyExampleEntity,
} from './entity._.get.db.server'
import { ExampleEntityExampleChildSchema } from './entity.child._schema'
import { type IExampleEntityExampleChildCloneSubmission } from './entity.child.clone.definitions'
import { type IExampleEntityExampleChildCreateData } from './entity.child.create.definitions'
import { cloneChildrenToExampleEntityService } from './entity.children.clone.service'

export const cloneExampleEntityExampleChildService = async ({
	userId,
	id,
	exampleEntityId, // parent entity id
	name,
	description,
}: IExampleEntityExampleChildCloneSubmission): Promise<IExampleEntityCreatedResponse> => {
	try {
		// Step 1: verify the child to clone exists
		const exampleEntity = await verifyExampleEntity({
			where: { id, ownerId: userId },
		})
		invariant(exampleEntity, 'Example entity to clone not found')

		// Step 2: verify the parent exists
		await verifyExampleEntity({
			where: { id: exampleEntityId, ownerId: userId },
		})

		// Potential Step: delete all example entity children after current or insert in correct position

		// Step 3: prepare data for cloned child
		const exampleEntityData = prepareExampleEntityCloneData({
			exampleEntity,
			userId,
			name,
			description,
		})

		// Step 4: clone the example entity via promise
		const cloneExampleEntityPromise = createExampleEntity({
			data: exampleEntityData,
		})

		// Step 5: execute the transactions
		// const [clonedExampleEntity] = await prisma.$transaction([
		// 	cloneExampleEntityPromise,
		// ])
		const [clonedExampleEntity] = await Promise.all([cloneExampleEntityPromise])

		// Potential Step: connect new node to current node
		// if adding to the end of the linked list
		// const connectNodesPromise = connectNodes({
		// 	type: LinkedListNodeTypeEnum.EXAMPLE_ENTITY,
		// 	prevId: exampleEntity.id,
		// 	nextId: clonedExampleEntity.id,
		// })
		// await prisma.$transaction(connectNodesPromise)

		// Potential Step: clone children from example entity
		// to the cloned example entity
		await cloneExampleChildrenToExampleEntity({
			userId,
			exampleEntity,
			clonedExampleEntity,
		})

		return {
			createdExampleEntity: clonedExampleEntity,
			success: true,
		}
	} catch (error) {
		return {
			success: false,
			message: getOptionalZodErrorMessage(error),
		}
	}
}

const prepareExampleEntityCloneData = ({
	exampleEntity,
	userId,
	name,
	description,
}: {
	exampleEntity: IExampleEntity
	userId: IUser['id']
	name: string
	description: string
}): IExampleEntityExampleChildCreateData => {
	// Step 1: build the child clone data
	const newName = name || exampleEntity.name
	const exampleEntityData = {
		name: newName,
		description: description || exampleEntity.description,
		ownerId: userId,
		exampleEntityId: exampleEntity.exampleEntityId,
	}
	// Step 3: validate the design data with the schema
	return ExampleEntityExampleChildSchema.parse(exampleEntityData)
}

const cloneExampleChildrenToExampleEntity = async ({
	userId,
	exampleEntity,
	clonedExampleEntity,
}: {
	userId: IUser['id']
	exampleEntity: IExampleEntity
	clonedExampleEntity: IExampleEntity
}): Promise<IExampleEntitiesClonedResponse> => {
	// Step 1: get the children of the example entity
	// you will want to make sure to get the children's children and so on as well
	// for cloning to cascade down the tree
	const exampleEntityChildren = await getExampleEntityWithChildren({
		where: { exampleEntityId: exampleEntity.id },
	})

	// Step 2: clone the children to the cloned example entity
	return await cloneChildrenToExampleEntityService({
		userId,
		exampleEntityId: clonedExampleEntity.id,
		children: exampleEntityChildren?.children || [],
	})
}
