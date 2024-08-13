import { LinkedListNodeTypeEnum } from '#app/models/__shared/linked-list.definitions'
import { connectNodes } from '#app/models/__shared/linked-list.node.update.server'
import { type IUser } from '#app/models/user/user.server'
import { getOptionalZodErrorMessage } from '#app/utils/misc'
import {
	type IExampleEntity,
	type IExampleEntityWithChildren,
} from './entity._._definitions'
import { type IExampleEntitiesClonedResponse } from './entity._.clone.definitions'
import { createExampleEntity } from './entity._.create.db.server'
import { ExampleEntityExampleChildSchema } from './entity.child._schema'
import { type IExampleEntityExampleChildCreateData } from './entity.child.create.definitions'
import { type IExampleEntityChildrenCloneSubmission } from './entity.children.clone.definitions'

// clone children to example entity as batch
export const cloneChildrenToExampleEntityService = async ({
	userId,
	exampleEntityId,
	children,
}: IExampleEntityChildrenCloneSubmission): Promise<IExampleEntitiesClonedResponse> => {
	try {
		// Step 2: Prepare children create data
		const exampleEntityCloneDataList = prepareExampleEntityCloneDataList({
			userId,
			exampleEntityId,
			children,
		})

		// Step 3: Create cloned children in order
		const cloneExampleEntityChildrenPromises = prepareClonePromises({
			exampleEntityCloneDataList,
		})
		const clonedExampleEntityChildren = await Promise.all(
			cloneExampleEntityChildrenPromises,
		)

		// After clone:
		// Potential Step: Prepare children update promises
		// e.g. re-link the cloned children
		// const updateClonedExampleEntityChildrenPromises = prepareExampleEntityChildrenLinkedListPromises({
		// 	clonedExampleEntityChildren,
		// })
		// await prisma.$transaction(updateClonedExampleEntityChildrenPromises)

		// Potential Step: clone childrens' children recursively
		// await cloneChildrenChildrenToClonedChildren({
		// 	userId,
		// 	children,
		// 	clonedExampleEntityChildren,
		// })

		return { success: true }
	} catch (error) {
		return {
			success: false,
			message: getOptionalZodErrorMessage(error),
		}
	}
}

const prepareExampleEntityCloneData = ({
	userId,
	child,
	exampleEntityId,
}: {
	userId: IUser['id']
	exampleEntityId: IExampleEntity['id']
	child: IExampleEntity
}): IExampleEntityExampleChildCreateData => {
	// Step 1: build the child data
	const { name, description, visible } = child
	const exampleEntityData = {
		name,
		description,
		visible,
		ownerId: userId,
		exampleEntityId,
	}
	// Step 2: validate the children data with the schema
	return ExampleEntityExampleChildSchema.parse(exampleEntityData)
}

const prepareExampleEntityCloneDataList = ({
	userId,
	exampleEntityId,
	children,
}: {
	userId: IUser['id']
	exampleEntityId: IExampleEntity['id']
	children: IExampleEntity[]
}): IExampleEntityExampleChildCreateData[] => {
	return children.map(child =>
		prepareExampleEntityCloneData({
			userId,
			child,
			exampleEntityId,
		}),
	)
}

const prepareClonePromises = ({
	exampleEntityCloneDataList,
}: {
	exampleEntityCloneDataList: IExampleEntityExampleChildCreateData[]
}): Promise<IExampleEntity>[] => {
	return exampleEntityCloneDataList.map(data => createExampleEntity({ data }))
}

const prepareExampleEntityChildrenLinkedListPromises = ({
	clonedExampleEntityChildren,
}: {
	clonedExampleEntityChildren: IExampleEntity[]
}) => {
	const promises = []

	// Step 1: first clone is the head of the linked list, no prevId
	let prevId: string | null = null

	// Step 2: iterate through the cloned children
	for (const clonedExampleEntity of clonedExampleEntityChildren) {
		// Step 3: connect the cloned child to the previous cloned child, if it exists
		if (prevId) {
			const connectExampleEntityPromise = connectNodes({
				type: LinkedListNodeTypeEnum.EXAMPLE_ENTITY,
				prevId,
				nextId: clonedExampleEntity.id,
			})
			promises.push(...connectExampleEntityPromise)
		}

		// Step 4: update the prevId for the next iteration
		prevId = clonedExampleEntity.id
	}
	return promises
}

const cloneChildrenChildrenToClonedChildren = async ({
	userId,
	children,
	clonedExampleEntityChildren,
}: {
	userId: IUser['id']
	children: IExampleEntityWithChildren[]
	clonedExampleEntityChildren: IExampleEntity[]
}) => {
	// Step 1: iterate through the each child and its clone
	for (let i = 0; i < children.length; i++) {
		const child = children[i]
		const clonedLayer = clonedExampleEntityChildren[i]

		// Step 2: get child's children
		const childChildren = child.children

		// Step 3: clone the child's children to its clone
		await cloneChildrenToExampleEntityService({
			userId,
			exampleEntityId: clonedLayer.id,
			children: childChildren,
		})
	}
}
