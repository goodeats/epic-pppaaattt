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
		prevNode: LinkedListNode
		prevPrevNode: LinkedListNode | null
		nextNode: LinkedListNode | null
	}
	type: linkedListNodeTypeEnum
}) => {
	const { node, prevNode, prevPrevNode, nextNode } = nodes

	const updatePromises = [
		updateNodeFields({
			type,
			where: { id: node.id },
			data: { prevId: prevNode.prevId, nextId: prevNode.id },
		}),
		updateNodeFields({
			type,
			where: { id: prevNode.id },
			data: { prevId: node.id, nextId: node.nextId },
		}),
	]

	if (prevPrevNode) {
		updatePromises.push(
			updateNodeFields({
				type,
				where: { id: prevPrevNode.id },
				data: { prevId: prevPrevNode.prevId, nextId: node.id },
			}),
		)
	}
	if (nextNode) {
		updatePromises.push(
			updateNodeFields({
				type,
				where: { id: nextNode.id },
				data: { prevId: node.prevId, nextId: nextNode.nextId },
			}),
		)
	}

	return updatePromises
}

export const moveLinkedListEntityUpService = async ({
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
		invariant(prevId, 'Entity is already at the top')

		// Step 2: get prev entity and its prev entity id to link to the current entity
		const prevNode = await verifyNode({
			type,
			where: { id: prevId, ownerId: userId },
		})
		const { prevId: prevPrevId } = prevNode

		// Step 3: get the adjacent nodes if they exist
		const { prevNode: prevPrevNode, nextNode } = await getAdjacentNodes({
			userId,
			type,
			prevId: prevPrevId,
			nextId,
		})

		const nodes = { node, prevNode, prevPrevNode, nextNode }
		const existingNodes = Object.values(nodes).filter(Boolean)

		// Step 4: remove nextId and prevId nodes from all nodes
		// this step is necessary due to unique constraints
		// for prevId and nextId fields at the database level
		const removePromises = updateNodesRemoveNodes({
			nodes: existingNodes,
			type,
		})

		// Step 5: update nextId and prevId nodes for current and prev nodes
		const updatePromises = updateEntityNodes({ nodes, type })

		// Step 6: run all move up promises
		await prisma.$transaction([...removePromises, ...updatePromises])

		return { success: true }
	} catch (error) {
		return { success: false, message: getOptionalZodErrorMessage(error) }
	}
}
