import { verifyDesign } from '../design/design.get.server'
import { verifyLayer } from '../layer/layer.get.server'
import { type IUser } from '../user/user.server'
import {
	type LinkedListNode,
	type LinkedListNodeId,
	LinkedListNodeTypeEnum,
	type linkedListNodeTypeEnum,
} from './linked-list.definitions'

export const verifyNode = ({
	type,
	where,
}: {
	type: linkedListNodeTypeEnum
	where: { id: LinkedListNodeId; ownerId: IUser['id'] }
}) => {
	switch (type) {
		case LinkedListNodeTypeEnum.DESIGN:
			return verifyDesign({ where })
		case LinkedListNodeTypeEnum.LAYER:
			return verifyLayer({ where })
		default:
			throw new Error(`Invalid linked list delete node type: ${type}`)
	}
}

export const getAdjacentNodes = async ({
	userId,
	type,
	prevId,
	nextId,
}: {
	userId: IUser['id']
	type: linkedListNodeTypeEnum
	prevId: LinkedListNode['prevId']
	nextId: LinkedListNode['nextId']
}) => {
	const nextNode = nextId
		? await verifyNode({
				type,
				where: { ownerId: userId, id: nextId },
			})
		: null

	const prevNode = prevId
		? await verifyNode({
				type,
				where: { ownerId: userId, id: prevId },
			})
		: null

	return { nextNode, prevNode }
}
