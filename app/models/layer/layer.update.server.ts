import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import {
	EditLayerDescriptionSchema,
	EditLayerNameSchema,
} from '#app/schema/layer'
import { ValidateLayerSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntitySubmission } from '#app/utils/conform-utils'
import { prisma } from '#app/utils/db.server'
import { findFirstLayerInstance } from '#app/utils/prisma-extensions-layer'
import { type ILayer } from '../layer/definitions'
import { type ILayerUpdateParams, type ILayerUpdatedResponse } from './definitions.update'
import {
	type queryLayerWhereArgsType,
	validateQueryWhereArgsPresent,
} from './layer.get.server'

type ILayerUpdateFields =
	| 'visible'
	| 'selected'
	| 'name'
	| 'description'
	| 'slug'
	| 'nextId'
	| 'prevId'

export const updateLayerField = ({
	id,
	ownerId,
	data,
}: ILayerUpdateParams & {
	data: Pick<Partial<ILayer>, ILayerUpdateFields>
}) => {
	return prisma.layer.update({
		where: { id, ownerId },
		data,
	})
}

export const updateLayerFields = ({
	where,
	data,
}: {
	where: queryLayerWhereArgsType
	data: Pick<Partial<ILayer>, ILayerUpdateFields>
}) => {
	validateQueryWhereArgsPresent(where)
	return prisma.layer.updateMany({
		where,
		data,
	})
}

export const updateLayerVisible = ({
	id,
	ownerId,
	visible,
}: ILayerUpdateParams & { visible: boolean }) => {
	return updateLayerField({
		id,
		ownerId,
		data: { visible },
	})
}

export const validateLayerNameSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateLayerSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema: EditLayerNameSchema,
		strategy,
	})
}

export const validateLayerDescriptionSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateLayerSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema: EditLayerDescriptionSchema,
		strategy,
	})
}

const getLayerInstance = async ({ id }: { id: ILayer['id'] }) => {
	return await findFirstLayerInstance({
		where: { id },
	})
}

// updating instance instead of regular prism update
// this may not be easier, but it's more explicit
export const updateLayerName = async ({
	id,
	name,
}: {
	id: ILayer['id']
	name: number
}): Promise<ILayerUpdatedResponse> => {
	const layer = await getLayerInstance({ id })
	if (!layer) return { success: false }

	try {
		const data = EditLayerNameSchema.parse({ id, name })
		layer.name = data.name
		layer.updatedAt = new Date()
		await layer.save()

		return { success: true, updatedLayer: layer }
	} catch (error) {
		// consider how to handle this error where this is called
		console.log('updateLayerName error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}

export const updateLayerDescription = async ({
	id,
	description,
}: {
	id: ILayer['id']
	description: number
}): Promise<ILayerUpdatedResponse> => {
	const layer = await getLayerInstance({ id })
	if (!layer) return { success: false }

	try {
		const data = EditLayerDescriptionSchema.parse({ id, description })
		layer.description = data.description ?? ''
		layer.updatedAt = new Date()
		await layer.save()

		return { success: true, updatedLayer: layer }
	} catch (error) {
		// consider how to handle this error where this is called
		console.log('updateLayerDescription error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}
