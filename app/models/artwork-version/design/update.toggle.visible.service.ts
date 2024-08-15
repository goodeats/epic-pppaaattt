import { type designTypeEnum } from '#app/models/design/definitions'
import { type IDesignUpdatedResponse } from '#app/models/design/definitions.update'
import { verifyDesign } from '#app/models/design/design.get.server'
import { updateSelectedDesignService } from '#app/models/design/design.update.selected.service'
import { updateDesignVisible } from '#app/models/design/design.update.server'
import { prisma } from '#app/utils/db.server'
import { getOptionalZodErrorMessage } from '#app/utils/misc'
import { verifyArtworkVersion } from '../artwork-version.get.server'
import { type IArtworkVersionDesignUpdateFieldSubmission } from './definitions.update'
import { UpdateArtworkVersionSelectedDesignStrategy } from './update.selected.strategy'

export const updateArtworkVersionDesignVisibleService = async ({
	userId,
	id,
	artworkVersionId,
}: IArtworkVersionDesignUpdateFieldSubmission): Promise<IDesignUpdatedResponse> => {
	try {
		// Step 1: verify the artwork version exists
		await verifyArtworkVersion({
			where: { id: artworkVersionId, ownerId: userId },
		})

		// Step 2: verify the design exists
		const design = await verifyDesign({
			where: { id, artworkVersionId, ownerId: userId },
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
		const strategy = new UpdateArtworkVersionSelectedDesignStrategy()
		const { success, message } = await updateSelectedDesignService({
			targetEntityId: artworkVersionId,
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
