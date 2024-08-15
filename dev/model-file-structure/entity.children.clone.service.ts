import { type IUser } from '#app/models/user/user.server'
import { getOptionalZodErrorMessage } from '#app/utils/misc'
import {
	type IExampleEntity,
	type IExampleEntityWithChildren,
} from './entity._._definitions'
import { getExampleEntityData } from './entity._._utils'
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
		// Step 2: Prepare children create data list
		const cloneDataList = prepareCloneDataList({
			userId,
			exampleEntityId,
			children,
		})

		// Step 3: Create cloned children in order
		const cloneExampleEntityChildrenPromises = prepareClonePromises({
			cloneDataList,
		})
		const clonedExampleEntityChildren = await Promise.all(
			cloneExampleEntityChildrenPromises,
		)

		// After clone:
		// Potential Step: Prepare children update promises
		// e.g. re-link the cloned children
		// const updateClonedPromises = connectUnlinkedNodes({
		// 	items: clonedExampleEntityChildren,
		// 	type: LinkedListNodeTypeEnum.ARTWORK_VERSION,
		// })
		// await Promise.all(updateClonedPromises)

		// Potential Step: clone childrens' children recursively
		await cloneChildrenChildrenToClonedChildren({
			userId,
			children,
			clonedExampleEntityChildren,
		})

		return { success: true }
	} catch (error) {
		return {
			success: false,
			message: getOptionalZodErrorMessage(error),
		}
	}
}

const validateCloneData = ({
	cloneData,
}: {
	cloneData: IExampleEntityExampleChildCreateData
}) => {
	return ExampleEntityExampleChildSchema.parse(cloneData)
}

const prepareCloneDataList = ({
	userId,
	exampleEntityId,
	children,
}: {
	userId: IUser['id']
	exampleEntityId: IExampleEntity['id']
	children: IExampleEntity[]
}): IExampleEntityExampleChildCreateData[] => {
	return children.map((child) =>
		validateCloneData({
			cloneData: {
				...getExampleEntityData({
					exampleEntity: child,
				}),
				ownerId: userId,
				exampleEntityId,
			},
		}),
	)
}

const prepareClonePromises = ({
	cloneDataList,
}: {
	cloneDataList: IExampleEntityExampleChildCreateData[]
}): Promise<IExampleEntity>[] => {
	return cloneDataList.map((data) => createExampleEntity({ data }))
}

const cloneChildrenChildrenToClonedChildren = async ({
	userId,
	children,
	clonedExampleEntityChildren,
}: {
	userId: IUser['id']
	children: IExampleEntity[] | IExampleEntityWithChildren[]
	clonedExampleEntityChildren: IExampleEntity[]
}) => {
	// Step 1: iterate through the each child and its clone
	for (let i = 0; i < children.length; i++) {
		const child = children[i]!
		const clonedLayer = clonedExampleEntityChildren[i]!

		// Type guard to check if child has children
		if (!('children' in child)) continue

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
