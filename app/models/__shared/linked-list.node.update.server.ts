import { updateArtworkVersionFields } from '../artwork-version/artwork-version.update.server'
import { updateDesignFields } from '../design/design.update.server'
import { updateLayerFields } from '../layer/layer.update.server'
import {
	type LinkedListNode,
	type LinkedListNodeId,
	LinkedListNodeTypeEnum,
	type linkedListNodeTypeEnum,
} from './linked-list.definitions'

// it was possible to use different strategies such as:
// - pattern design strategy
// - class with overriding functions
// - perhaps even more
// but adding a type to use right before sending a database query/mutation
// is much simpler and easier to understand
// and accomplishes the same goal

export const updateNodeFields = ({
	type,
	where,
	data,
}: {
	type: linkedListNodeTypeEnum
	where: { id: LinkedListNodeId }
	data: {
		prevId?: LinkedListNodeId | null
		nextId?: LinkedListNodeId | null
	}
}) => {
	switch (type) {
		case LinkedListNodeTypeEnum.ARTWORK_VERSION:
			return updateArtworkVersionFields({ where, data })
		case LinkedListNodeTypeEnum.DESIGN:
			return updateDesignFields({ where, data })
		case LinkedListNodeTypeEnum.LAYER:
			return updateLayerFields({ where, data })
		default:
			throw new Error(`Invalid linked list delete node type: ${type}`)
	}
}

export const connectNodes = ({
	type,
	prevId,
	nextId,
}: {
	type: linkedListNodeTypeEnum
	prevId: LinkedListNodeId
	nextId: LinkedListNodeId
}) => {
	const connectNextToPrev = updateNodeFields({
		type,
		where: { id: prevId },
		data: { nextId },
	})
	const connectPrevToNext = updateNodeFields({
		type,
		where: { id: nextId },
		data: { prevId },
	})
	return [connectNextToPrev, connectPrevToNext]
}

export const connectUnlinkedNodes = ({
	items,
	type,
}: {
	items: LinkedListNode[]
	type: linkedListNodeTypeEnum
}) => {
	// Step 1: Initialize prevId as null
	let prevId: string | null = null

	// Step 2: Use map to iterate through the items and create promises
	const promises = items.flatMap((item) => {
		const connectPromise = prevId
			? connectNodes({
					type,
					prevId,
					nextId: item.id,
				})
			: []

		// Step 3: Update prevId for the next iteration
		prevId = item.id

		return connectPromise
	})

	return promises
}

export const updateNodeToHead = ({
	id,
	type,
}: {
	id: LinkedListNodeId
	type: linkedListNodeTypeEnum
}) => {
	return updateNodeFields({
		type,
		where: { id },
		data: { prevId: null },
	})
}

export const updateNodeToTail = ({
	id,
	type,
}: {
	id: LinkedListNodeId
	type: linkedListNodeTypeEnum
}) => {
	return updateNodeFields({
		type,
		where: { id },
		data: { nextId: null },
	})
}

export const updateNodeRemoveNodes = ({
	id,
	type,
}: {
	id: LinkedListNodeId
	type: linkedListNodeTypeEnum
}) => {
	return updateNodeFields({
		type,
		where: { id },
		data: { prevId: null, nextId: null },
	})
}

export const updateNodesRemoveNodes = ({
	nodes,
	type,
}: {
	nodes: LinkedListNode[]
	type: linkedListNodeTypeEnum
}) => {
	return nodes.map((node) =>
		updateNodeFields({
			type,
			where: { id: node.id },
			data: { prevId: null, nextId: null },
		}),
	)
}

export const updateNodeNodes = ({
	id,
	type,
	nextId,
	prevId,
}: {
	id: string
	type: linkedListNodeTypeEnum
	nextId: string | null
	prevId: string | null
}) => {
	return updateNodeFields({
		type,
		where: { id },
		data: { prevId, nextId },
	})
}
