import { verifyDesign } from '#app/models/design/design.get.server'
import { designTypeEnum } from '#app/models/design/definitions'
import { getOptionalZodErrorMessage } from '#app/utils/misc'
import { verifyArtworkVersion } from '../artwork-version.get.server'
import { UpdateArtworkVersionSelectedDesignStrategy } from './update.selected.strategy'
import { updateSelectedDesignService } from '#app/models/design/design.update.selected.service'
import { IArtworkVersionDesignDeleteSubmission } from './definitions.delete'
import { IDesignDeletedResponse } from '#app/models/design/definitions.delete'
import { LinkedListNodeTypeEnum } from '#app/models/__shared/linked-list.definitions'
import { deleteLinkedListNodeService } from '#app/models/__shared/linked-list.node.delete.service'

export const deleteArtworkVersionDesignService = async ({
	userId,
	id,
	artworkVersionId,
}: IArtworkVersionDesignDeleteSubmission): Promise<IDesignDeletedResponse> => {
	try {
		// Step 1: verify the artwork version exists
		await verifyArtworkVersion({
			where: { id: artworkVersionId, ownerId: userId },
		})

		// Step 2: verify the design exists
		const design = await verifyDesign({
			where: { id, artworkVersionId, ownerId: userId },
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
			const strategy = new UpdateArtworkVersionSelectedDesignStrategy()
			const { success, message } = await updateSelectedDesignService({
				targetEntityId: artworkVersionId,
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
