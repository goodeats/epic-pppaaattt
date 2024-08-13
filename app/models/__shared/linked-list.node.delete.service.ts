import { type IDeletedResponse } from '#app/definitions/intent-action-args'
import { prisma } from '#app/utils/db.server'
import { getOptionalZodErrorMessage } from '#app/utils/misc'
import { type IUser } from '../user/user.server'
import {
	type LinkedListNode,
	type LinkedListNodeId,
	type linkedListNodeTypeEnum,
} from './linked-list.definitions'
import { deleteNode } from './linked-list.node.delete.server'
import { getAdjacentNodes, verifyNode } from './linked-list.node.get.server'
import {
	connectNodes,
	updateNodeToHead,
	updateNodeToTail,
} from './linked-list.node.update.server'

const updateAdjacentNodes = ({
	type,
	nextNode,
	prevNode,
}: {
	type: linkedListNodeTypeEnum
	nextNode: LinkedListNode | null
	prevNode: LinkedListNode | null
}) => {
	const promises = []

	if (!prevNode && nextNode) {
		promises.push(
			updateNodeToHead({
				id: nextNode.id,
				type,
			}),
		)
	} else if (!nextNode && prevNode) {
		promises.push(
			updateNodeToTail({
				id: prevNode.id,
				type,
			}),
		)
	} else if (prevNode && nextNode) {
		promises.push(
			...connectNodes({
				type,
				prevId: prevNode.id,
				nextId: nextNode.id,
			}),
		)
	}

	return promises
}

export const deleteLinkedListNodeService = async ({
	userId,
	id,
	type,
}: {
	userId: IUser['id']
	id: LinkedListNodeId
	type: linkedListNodeTypeEnum
}): Promise<IDeletedResponse> => {
	try {
		const promises = []

		// Step 1: get the current node to be deleted
		const node = await verifyNode({
			type,
			where: { id, ownerId: userId },
		})
		const { prevId, nextId } = node

		// Step 2: get the adjacent nodes if they exist
		const { prevNode, nextNode } = await getAdjacentNodes({
			userId,
			type,
			prevId,
			nextId,
		})

		// Step 3: delete the node
		const deleteDesignPromise = deleteNode({
			type,
			where: { id, ownerId: userId },
		})
		promises.push(deleteDesignPromise)

		// Step 4: update next/prev designs if they exist
		// maintain linked list integrity
		const updateAdjacentNodesPromise = updateAdjacentNodes({
			type,
			nextNode,
			prevNode,
		})
		promises.push(...updateAdjacentNodesPromise)

		// Step 5: Run all update promises
		await prisma.$transaction(promises)

		return { success: true }
	} catch (error) {
		return { success: false, message: getOptionalZodErrorMessage(error) }
	}
}
