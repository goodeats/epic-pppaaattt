import { type PrismaPromise } from '@prisma/client'
import { type IDesignsClonedResponse } from '#app/models/design/definitions.clone'
import { createDesign } from '#app/models/design/design.create.server'
import { groupDesignTypes } from '#app/models/design/utils'
import { prisma } from '#app/utils/db.server'
import { getOptionalZodErrorMessage } from '#app/utils/misc'
import { initializeEnumItemsMap } from '#app/utils/typescript-helpers'
import { LinkedListNodeTypeEnum } from '../__shared/linked-list.definitions'
import { connectNodes } from '../__shared/linked-list.node.update.server'
import {
	DesignTypeEnum,
	type IDesign,
	type IDesignAttributes,
	type IDesignType,
	type designTypeEnum,
	designTypes,
} from '../design/definitions'
import { updateDesignAttributes } from '../design/design.update.server'
import { type IUser } from '../user/user.server'
import { type ILayer } from './definitions'
import { type ILayerDesignCloneSubmission } from './design.definitions.clone'
import { type ILayerDesignCreateData } from './design.definitions.create'
import { findLayerDesignSchemaByType } from './design.utils'

// Note: please read the comments carefully when making changes
// It seems prisma will not allow creating a design attribute with json string, just '{}' for some reason
// So we have to update the design attributes after creating them
// this bug alone makes the code more complex than it should be
// might be ok here since we also have to re-link the cloned designs

// A. what happens if I am cloning without considering the design types have selected figured out?
// aka cloning a single design type... something for later like imports

export const cloneDesignsToLayerService = async ({
	userId,
	layerId,
	designs,
}: ILayerDesignCloneSubmission): Promise<IDesignsClonedResponse> => {
	try {
		// Step 1: group designs by type
		const groupedDesignTypes = groupDesignTypes({ designs })

		// Step 2: Prepare design create data
		const { validatedDesignCreateDataList, clonedDesignTypeAttributesMap } =
			prepareDesignCreateData({
				groupedDesignTypes,
				userId,
				layerId,
			})

		// Step 3: Create cloned designs in order
		const createDesignPromises = prepareDesignCreatePromises({
			validatedDesignCreateDataList,
		})
		// Step 3.1: Execute transaction
		const createdDesigns = await prisma.$transaction(createDesignPromises)
		// Step 3.2: Map created designs by type
		const createdDesignTypeMap = mapCreatedDesignsByType({ createdDesigns })

		// Step 4: [Prisma bug solution] update created design attributes
		// since Prisma is returning created as '{}' for some reason
		// also re-link the cloned designs as a linked list
		const updateDesignPromises = prepareDesignUpdatePromises({
			userId,
			createdDesignTypeMap,
			clonedDesignTypeAttributesMap,
		})

		// Step 4.1: Execute transaction
		await prisma.$transaction(updateDesignPromises)

		return { success: true }
	} catch (error) {
		return {
			success: false,
			message: getOptionalZodErrorMessage(error),
		}
	}
}

const validateDesignData = ({
	design,
	userId,
	layerId,
}: {
	design: IDesignType
	userId: IUser['id']
	layerId: ILayer['id']
}): ILayerDesignCreateData => {
	// Step 1: build the design data
	const { type, visible, selected, attributes } = design
	const designData = {
		type,
		visible,
		selected,
		attributes,
		ownerId: userId,
		layerId,
	}
	// Step 2: find the schema for the design type
	const schema = findLayerDesignSchemaByType({ type })
	// Step 3: validate the design data with the schema
	return schema.parse(designData)
}

const prepareDesignCreateData = ({
	groupedDesignTypes,
	userId,
	layerId,
}: {
	groupedDesignTypes: IDesignType[][]
	userId: IUser['id']
	layerId: ILayer['id']
}) => {
	// Step 1: initialize data for creating designs
	// Step 1.1: validated design create data list
	const validatedDesignCreateDataList: ILayerDesignCreateData[] = []
	// Step 1.2: cloned design attributes by type
	const clonedDesignTypeAttributesMap = initializeEnumItemsMap<
		typeof DesignTypeEnum,
		IDesignAttributes
	>(DesignTypeEnum)

	// Step 2: Prepare design data
	for (const designs of groupedDesignTypes) {
		// Step 3: validate each design data
		for (const design of designs) {
			const { type } = design
			const validatedDesignData = validateDesignData({
				design,
				userId,
				layerId,
			})

			// Step 4: insert into list for creating design promises
			validatedDesignCreateDataList.push(validatedDesignData)

			// Step 5: insert into mapped list for updating design attribute promises by type after create
			clonedDesignTypeAttributesMap[type].push(validatedDesignData.attributes)
		}
	}

	return {
		validatedDesignCreateDataList,
		clonedDesignTypeAttributesMap,
	}
}

const prepareDesignCreatePromises = ({
	validatedDesignCreateDataList,
}: {
	validatedDesignCreateDataList: ILayerDesignCreateData[]
}): PrismaPromise<IDesign>[] => {
	const createDesignPromises = []
	// Step 1: iterate through the validated design create data list
	for (const data of validatedDesignCreateDataList) {
		// Step 2: create the design promise
		const createdDesignPromise = createDesign({ data })
		createDesignPromises.push(createdDesignPromise)
	}
	return createDesignPromises
}

const mapCreatedDesignsByType = ({
	createdDesigns,
}: {
	createdDesigns: IDesign[]
}): Record<designTypeEnum, IDesign[]> => {
	// Step 1: initialize the map with empty arrays for each design type
	const createdDesignTypeMap = initializeEnumItemsMap<
		typeof DesignTypeEnum,
		IDesign
	>(DesignTypeEnum)

	// Step 2: map the created designs by type
	createdDesigns.forEach(createdDesign => {
		const type = createdDesign.type as designTypeEnum
		// Step 3: push the created design into the corresponding type array
		createdDesignTypeMap[type].push(createdDesign)
	})
	return createdDesignTypeMap
}

const prepareDesignTypeUpdatePromises = ({
	userId,
	type,
	createdDesignTypes,
	clonedDesignTypeAttributes,
}: {
	userId: IUser['id']
	type: designTypeEnum
	createdDesignTypes: IDesign[]
	clonedDesignTypeAttributes: IDesignAttributes[]
}) => {
	const updatePromises = []

	// Step 1: first design is the head of the linked list, no prevId
	let prevId: string | null = null

	// Step 2: iterate through the current type of created designs
	for (const createdDesignType of createdDesignTypes) {
		// Step 3: remove the first cloned attributes from the array
		// so that the attributes are in order with the current design
		const clonedAttributes = clonedDesignTypeAttributes.shift()!

		// Step 4: update the design attributes
		const updatedDesignAttributesPromise = updateDesignAttributes({
			id: createdDesignType.id,
			ownerId: userId,
			type,
			attributes: clonedAttributes,
		})
		updatePromises.push(updatedDesignAttributesPromise)

		// Step 5: connect the designs as a linked list, if prevId exists
		if (prevId) {
			const connectDesignsPromise = connectNodes({
				type: LinkedListNodeTypeEnum.DESIGN,
				prevId,
				nextId: createdDesignType.id,
			})
			updatePromises.push(...connectDesignsPromise)
		}

		// Step 6: update the prevId for the next iteration
		prevId = createdDesignType.id
	}

	return updatePromises
}

const prepareDesignUpdatePromises = ({
	userId,
	createdDesignTypeMap,
	clonedDesignTypeAttributesMap,
}: {
	userId: IUser['id']
	createdDesignTypeMap: Record<designTypeEnum, IDesign[]>
	clonedDesignTypeAttributesMap: Record<designTypeEnum, IDesignAttributes[]>
}) => {
	const updatePromises = []

	// Step 1: iterate through each design type
	for (const type of designTypes) {
		// Step 2: get the created designs and cloned attributes for the current type
		const createdDesignTypes = createdDesignTypeMap[type]
		const clonedDesignTypeAttributes = clonedDesignTypeAttributesMap[type]

		// Step 3: prepare the update promises for the current type
		const updateDesignTypePromises = prepareDesignTypeUpdatePromises({
			userId,
			type,
			createdDesignTypes,
			clonedDesignTypeAttributes,
		})
		updatePromises.push(...updateDesignTypePromises)
	}

	return updatePromises
}
