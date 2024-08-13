import { type User } from '@prisma/client'
import { getDesign } from '#app/models/design/design.get.server'
import {
	type IDesign,
	type IDesignEntityId,
} from '#app/models/design/definitions'
import { designTypeEnum } from '#app/models/design/definitions'
import { type IUpdateSelectedDesignStrategy } from '#app/strategies/design/update-selected.strategy'
import { prisma } from '#app/utils/db.server'
import { updateDesignVisible } from '#app/models/design/design.update.server'
import { updateSelectedDesignService } from '#app/models/design/design.update.selected.service'
import { IDesignUpdatedResponse } from '#app/models/design/definitions.update'

export const designToggleVisibleService = async ({
	userId,
	id,
	targetEntityId,
	updateSelectedDesignStrategy,
}: {
	userId: User['id']
	id: IDesign['id']
	targetEntityId: IDesignEntityId
	updateSelectedDesignStrategy: IUpdateSelectedDesignStrategy
}): Promise<IDesignUpdatedResponse> => {
	try {
		// Step 1: get the design
		const design = await fetchtDesign({ id, userId })
		const { visible } = design
		const type = design.type as designTypeEnum

		// Step 2: update the design visible state
		const toggleDesignVisiblePromise = updateDesignVisible({
			id,
			ownerId: userId,
			visible: !visible,
		})
		const [updatedDesign] = await prisma.$transaction([
			toggleDesignVisiblePromise,
		])

		// Step 3: update the selected design for its type, if necessary
		// visibility is more complicated than just going by the current design state
		await updateSelectedDesignService({
			targetEntityId,
			type,
			strategy: updateSelectedDesignStrategy,
		})

		return { updatedDesign, success: true }
	} catch (error) {
		console.log('designToggleVisibleService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}

const fetchtDesign = async ({
	id,
	userId,
}: {
	id: IDesign['id']
	userId: User['id']
}) => {
	const design = await getDesign({
		where: { id, ownerId: userId },
	})

	if (!design) throw new Error(`Design not found: ${id}`)

	return design
}
