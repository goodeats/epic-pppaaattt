import { verifyDesign } from '#app/models/design/design.get.server'
import { designTypeEnum } from '#app/models/design/definitions'
import { getOptionalZodErrorMessage } from '#app/utils/misc'
import { updateSelectedDesignService } from '#app/models/design/design.update.selected.service'
import { IDesignDeletedResponse } from '#app/models/design/definitions.delete'
import { verifyLayer } from './layer.get.server'
import { ILayerDesignDeleteSubmission } from './design.definitions.delete'
import { UpdateLayerSelectedDesignStrategy } from './design.update.selected.strategy'
import { deleteLinkedListNodeService } from '../__shared/linked-list.node.delete.service'
import { LinkedListNodeTypeEnum } from '../__shared/linked-list.definitions'

export const deleteLayerDesignService = async ({
	userId,
	id,
	layerId,
}: ILayerDesignDeleteSubmission): Promise<IDesignDeletedResponse> => {
	try {
		// Step 1: verify the layer exists
		await verifyLayer({
			where: { id: layerId, ownerId: userId },
		})

		// Step 2: verify the design exists
		const design = await verifyDesign({
			where: { id, layerId, ownerId: userId },
		})

		// Step 3: delete the design
		const { success, message } = await deleteLinkedListNodeService({
			userId,
			id,
			type: LinkedListNodeTypeEnum.DESIGN,
		})
		if (!success) return { success, message }

		// Step 4: update the selected design, if necessary
		if (design.selected) {
			const strategy = new UpdateLayerSelectedDesignStrategy()
			const { success, message } = await updateSelectedDesignService({
				targetEntityId: layerId,
				type: design.type as designTypeEnum,
				strategy,
			})

			return { success, message }
		}

		return { success: true }
	} catch (error) {
		return {
			success: false,
			message: getOptionalZodErrorMessage(error),
		}
	}
}
