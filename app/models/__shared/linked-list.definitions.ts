import { ObjectValues } from '#app/utils/typescript-helpers'
import { IArtworkBranch } from '../artwork-branch/_._definitions'
import { IArtworkVersion } from '../artwork-version/definitions'
import { IDesign, IDesignParsed } from '../design/definitions'
import { ILayer } from '../layer/definitions'

export type LinkedListNode = IArtworkVersion | IDesign | IDesignParsed | ILayer
export type LinkedListNodeId = IDesign['id'] | ILayer['id']
export type LinkedListNodeParent = IArtworkBranch | IArtworkVersion | ILayer
export type LinkedListNodeParentId =
	| IArtworkBranch['id']
	| IArtworkVersion['id']
	| ILayer['id']

export const LinkedListNodeTypeEnum = {
	ARTWORK_VERSION: 'artwork-version',
	DESIGN: 'design',
	LAYER: 'layer',
	EXAMPLE_ENTITY: 'example-entity',
	// add more types here
} as const
export type linkedListNodeTypeEnum = ObjectValues<typeof LinkedListNodeTypeEnum>
