import { createDesign } from '#app/models/design/design.create.server'
import {
	getDesign,
	getDesignsCount,
} from '#app/models/design/design.get.server'
import { updateDesignAttributes } from '#app/models/design/design.update.server'
import { findDesignAttributesDefaultSchemaByType } from '#app/models/design/utils'
import { prisma } from '#app/utils/db.server'
import { getOptionalZodErrorMessage } from '#app/utils/misc'
import { IDesignCreatedResponse } from '#app/models/design/definitions.create'
import { LinkedListNodeTypeEnum } from '#app/models/__shared/linked-list.definitions'
import { connectNodes } from '#app/models/__shared/linked-list.node.update.server'
import { ILayerDesignCreateSubmission } from './design.definitions.create'
import { verifyLayer } from './layer.get.server'
import { ILayer } from './definitions'
import { designTypeEnum } from '../design/definitions'
import { findLayerDesignSchemaByType } from './design.utils'

export const createLayerDesignService = async ({
	userId,
	layerId,
	type,
}: ILayerDesignCreateSubmission): Promise<IDesignCreatedResponse> => {
	try {
		// Step 1: verify the layer exists
		await verifyLayer({
			where: { id: layerId, ownerId: userId },
		})

		// Step 2: determine if the design should be selected
		const shouldSetSelected = await shouldUpdateSelectedDesign({
			layerId,
			type,
		})

		// Step 3: validate design data
		// potentially includes data from cloned design data
		const attributesDefaultSchema = findDesignAttributesDefaultSchemaByType({
			type,
		})
		const validatedAttributes = attributesDefaultSchema.parse({})
		const schema = findLayerDesignSchemaByType({ type })
		const designData = {
			type,
			visible: true,
			selected: shouldSetSelected,
			attributes: validatedAttributes,
			ownerId: userId,
			layerId,
		}
		const validatedDesignData = schema.parse(designData)

		// Step 4: find existing designs tail (before creating new design)
		const getTailPromise = getDesign({
			where: { type, layerId, nextId: null },
		})

		// Step 5: create the design via promise
		const createDesignPromise = createDesign({
			data: { ...validatedDesignData },
		})

		// Step 6: execute the transactions
		const [prevTail, createdDesign] = await prisma.$transaction([
			getTailPromise,
			createDesignPromise,
		])

		// Step 7: update the design attributes
		// this is an unfortunate bug I can't seem to solve
		// the createdDesign attributes are being submitted correctly in the data
		// but the createdDesign.attributes returns as "{}"
		// after lots of debugging I'm settling on just running an update after create
		// which works and is a good enough solution for now
		// I'm blaming prisma and a good excuse to move to drizzle
		const updatedDesignPromise = updateDesignAttributes({
			id: createdDesign.id,
			ownerId: userId,
			type,
			attributes: validatedAttributes,
		})
		const [updatedDesign] = await prisma.$transaction([updatedDesignPromise])

		// Step 7: connect new design to tail design, if it exists
		if (prevTail) {
			const connectDesignsPromise = connectNodes({
				type: LinkedListNodeTypeEnum.DESIGN,
				prevId: prevTail.id,
				nextId: createdDesign.id,
			})
			await prisma.$transaction(connectDesignsPromise)
		}

		return {
			createdDesign: updatedDesign,
			success: true,
		}
	} catch (error) {
		return {
			success: false,
			message: getOptionalZodErrorMessage(error),
		}
	}
}

const shouldUpdateSelectedDesign = async ({
	layerId,
	type,
}: {
	layerId: ILayer['id']
	type: designTypeEnum
}) => {
	// check if there are no visible designs of the same type
	// if there are none, then the new design should be selected
	const visibleLayerDesignsByTypeCount = await getDesignsCount({
		where: { layerId, type, visible: true },
	})
	return visibleLayerDesignsByTypeCount === 0
}
