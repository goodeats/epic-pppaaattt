import { invariant } from '@epic-web/invariant'
import { prisma } from '#app/utils/db.server'
import { getOptionalZodErrorMessage } from '#app/utils/misc'
import { type IUser } from '../user/user.server'
import {
	type linkedListNodeTypeEnum,
	type LinkedListNode,
} from './linked-list.definitions'
import { getAdjacentNodes, verifyNode } from './linked-list.node.get.server'
import {
	updateNodeFields,
	updateNodesRemoveNodes,
} from './linked-list.node.update.server'

const updateEntityNodes = ({
	nodes,
	type,
}: {
	nodes: {
		node: LinkedListNode
		nextNode: LinkedListNode
		nextNextNode: LinkedListNode | null
		prevNode: LinkedListNode | null
	}
	type: linkedListNodeTypeEnum
}) => {
	const { node, nextNode, nextNextNode, prevNode } = nodes

	const updatePromises = [
		updateNodeFields({
			type,
			where: { id: node.id },
			data: { prevId: nextNode.id, nextId: nextNode.nextId },
		}),
		updateNodeFields({
			type,
			where: { id: nextNode.id },
			data: { prevId: node.prevId, nextId: node.id },
		}),
	]

	if (nextNextNode) {
		updatePromises.push(
			updateNodeFields({
				type,
				where: { id: nextNextNode.id },
				data: { prevId: node.id, nextId: nextNextNode.nextId },
			}),
		)
	}
	if (prevNode) {
		updatePromises.push(
			updateNodeFields({
				type,
				where: { id: prevNode.id },
				data: { prevId: prevNode.prevId, nextId: node.nextId },
			}),
		)
	}

	return updatePromises
}

export const moveLinkedListEntityDownService = async ({
	userId,
	id,
	type,
}: {
	userId: IUser['id']
	id: LinkedListNode['id']
	type: linkedListNodeTypeEnum
}) => {
	try {
		// Step 1: get the current entity
		const node = await verifyNode({
			type,
			where: { id, ownerId: userId },
		})
		const { prevId, nextId } = node
		invariant(nextId, 'Entity is already at the bottom')

		// Step 2: get next entity and its next entity id to link to the current entity
		const nextNode = await verifyNode({
			type,
			where: { id: nextId, ownerId: userId },
		})
		const { nextId: nextNextId } = nextNode

		// Step 3: get the adjacent entities if they exist
		const { nextNode: nextNextNode, prevNode } = await getAdjacentNodes({
			userId,
			type,
			prevId,
			nextId: nextNextId,
		})

		const nodes = { node, nextNode, nextNextNode, prevNode }
		const existingNodes = Object.values(nodes).filter(Boolean)

		// Step 4: remove nextId and prevId nodes from all entities
		// this step is necessary due to unique constraints
		// for prevId and nextId fields at the database level
		const removePromises = updateNodesRemoveNodes({
			nodes: existingNodes,
			type,
		})

		// Step 5: update nextId and prevId nodes for current and next entities
		const updatePromises = updateEntityNodes({ nodes, type })

		// Step 6: run all move down promises
		await prisma.$transaction([...removePromises, ...updatePromises])

		return { success: true }
	} catch (error) {
		return { success: false, message: getOptionalZodErrorMessage(error) }
	}
}
