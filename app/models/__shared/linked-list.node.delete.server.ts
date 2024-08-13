import { deleteDesign } from '../design/design.delete.server'
import { deleteLayer } from '../layer/layer.delete.server'
import { type IUser } from '../user/user.server'
import {
	type LinkedListNodeId,
	LinkedListNodeTypeEnum,
	type linkedListNodeTypeEnum,
} from './linked-list.definitions'

export const deleteNode = ({
	type,
	where,
}: {
	type: linkedListNodeTypeEnum
	where: { id: LinkedListNodeId; ownerId: IUser['id'] }
}) => {
	switch (type) {
		case LinkedListNodeTypeEnum.DESIGN:
			return deleteDesign(where)
		case LinkedListNodeTypeEnum.LAYER:
			return deleteLayer(where)
		default:
			throw new Error(`Invalid linked list delete node type: ${type}`)
	}
}
