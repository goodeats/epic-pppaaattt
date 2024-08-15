import { type designTypeEnum } from '#app/models/design/definitions'
import { type IDesignUpdatedResponse } from '#app/models/design/definitions.update'
import { verifyDesign } from '#app/models/design/design.get.server'
import { updateSelectedDesignService } from '#app/models/design/design.update.selected.service'
import { getOptionalZodErrorMessage } from '#app/utils/misc'
import { LinkedListNodeTypeEnum } from '../__shared/linked-list.definitions'
import { moveLinkedListEntityUpService } from '../__shared/linked-list.node.move-up.service'
import { type ILayerDesignUpdateOrderSubmission } from './design.definitions.update'
import { UpdateLayerSelectedDesignStrategy } from './design.update.selected.strategy'
import { verifyLayer } from './layer.get.server'

export const updateLayerDesignReorderMoveUpService = async ({
	userId,
	id,
	layerId,
}: ILayerDesignUpdateOrderSubmission): Promise<IDesignUpdatedResponse> => {
	try {
		// Step 1: verify the layer exists
		await verifyLayer({
			where: { id: layerId, ownerId: userId },
		})

		// Step 2: verify the design exists
		const design = await verifyDesign({
			where: { id, layerId, ownerId: userId },
		})

		// Step 3: move the design down
		const { success, message } = await moveLinkedListEntityUpService({
			userId,
			id,
			type: LinkedListNodeTypeEnum.DESIGN,
		})
		if (!success) return { success, message }

		// Step 4: update the selected design, if necessary
		const strategy = new UpdateLayerSelectedDesignStrategy()
		const { success: selectedSuccess, message: selectedMessage } =
			await updateSelectedDesignService({
				targetEntityId: layerId,
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