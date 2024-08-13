import { LinkedListNodeTypeEnum } from '#app/models/__shared/linked-list.definitions'
import { moveLinkedListEntityUpService } from '#app/models/__shared/linked-list.node.move-up.service'
import { type designTypeEnum } from '#app/models/design/definitions'
import { type IDesignUpdatedResponse } from '#app/models/design/definitions.update'
import { verifyDesign } from '#app/models/design/design.get.server'
import { updateSelectedDesignService } from '#app/models/design/design.update.selected.service'
import { getOptionalZodErrorMessage } from '#app/utils/misc'
import { verifyArtworkVersion } from '../artwork-version.get.server'
import { type IArtworkVersionDesignUpdateOrderSubmission } from './definitions.update'
import { UpdateArtworkVersionSelectedDesignStrategy } from './update.selected.strategy'

export const updateArtworkVersionDesignReorderMoveUpService = async ({
	userId,
	id,
	artworkVersionId,
}: IArtworkVersionDesignUpdateOrderSubmission): Promise<IDesignUpdatedResponse> => {
	try {
		// Step 1: verify the artwork version exists
		await verifyArtworkVersion({
			where: { id: artworkVersionId, ownerId: userId },
		})

		// Step 2: verify the design exists
		const design = await verifyDesign({
			where: { id, artworkVersionId, ownerId: userId },
		})

		// Step 3: move the design up
		const { success, message } = await moveLinkedListEntityUpService({
			userId,
			id,
			type: LinkedListNodeTypeEnum.DESIGN,
		})
		if (!success) return { success, message }

		// Step 4: update the selected design, if necessary
		const strategy = new UpdateArtworkVersionSelectedDesignStrategy()
		const { success: selectedSuccess, message: selectedMessage } =
			await updateSelectedDesignService({
				targetEntityId: artworkVersionId,
				type: design.type as designTypeEnum,
				strategy,
			})
		if (!selectedSuccess)
			return { success: selectedSuccess, message: selectedMessage }

		return { success, message }
	} catch (error) {
		return {
			success: false,
			message: getOptionalZodErrorMessage(error),
		}
	}
}
