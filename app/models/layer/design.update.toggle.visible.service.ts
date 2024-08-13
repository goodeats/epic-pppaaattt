import { type designTypeEnum } from '#app/models/design/definitions'
import { type IDesignUpdatedResponse } from '#app/models/design/definitions.update'
import { verifyDesign } from '#app/models/design/design.get.server'
import { updateSelectedDesignService } from '#app/models/design/design.update.selected.service'
import { updateDesignVisible } from '#app/models/design/design.update.server'
import { prisma } from '#app/utils/db.server'
import { getOptionalZodErrorMessage } from '#app/utils/misc'
import { type ILayerDesignUpdateFieldSubmission } from './design.definitions.update'
import { UpdateLayerSelectedDesignStrategy } from './design.update.selected.strategy'
import { verifyLayer } from './layer.get.server'

export const updateLayerDesignVisibleService = async ({
	userId,
	id,
	layerId,
}: ILayerDesignUpdateFieldSubmission): Promise<IDesignUpdatedResponse> => {
	try {
		// Step 1: verify the layer exists
		await verifyLayer({
			where: { id: layerId, ownerId: userId },
		})

		// Step 2: verify the design exists
		const design = await verifyDesign({
			where: { id, layerId, ownerId: userId },
		})

		// Step 3: update the design
		const updateDesignVisiblePromise = updateDesignVisible({
			id,
			ownerId: userId,
			visible: !design.visible,
		})
		const [updatedDesign] = await prisma.$transaction([
			updateDesignVisiblePromise,
		])

		// Step 4: update the selected design, if necessary
		const strategy = new UpdateLayerSelectedDesignStrategy()
		const { success, message } = await updateSelectedDesignService({
			targetEntityId: layerId,
			type: design.type as designTypeEnum,
			strategy,
		})

		return {
			success,
			message,
			updatedDesign,
		}
	} catch (error) {
		return {
			success: false,
			message: getOptionalZodErrorMessage(error),
		}
	}
}
