import { verifyDesign } from '#app/models/design/design.get.server'
import { getOptionalZodErrorMessage } from '#app/utils/misc'
import { prisma } from '#app/utils/db.server'
import { DesignAttributesFillSchema } from './schema'
import { parseDesignFillAttributes } from './utils'
import { updateDesignFillAttributes } from './update.server'
import { IDesignFillUpdateValueSubmission } from './definitions.update'
import { IDesignUpdatedResponse } from '../definitions.update'

export const updateDesignFillValueService = async ({
	userId,
	id,
	value,
}: IDesignFillUpdateValueSubmission): Promise<IDesignUpdatedResponse> => {
	try {
		// Step 1: verify the design exists
		const design = await verifyDesign({
			where: { id, ownerId: userId },
		})

		// Step 2: validate the update data
		const parsedAttributes = parseDesignFillAttributes(design.attributes)
		const validatedAttributes = DesignAttributesFillSchema.parse({
			...parsedAttributes,
			value,
		})

		// Step 3: update the design
		const updateDesignFillPromise = updateDesignFillAttributes({
			id,
			ownerId: userId,
			data: {
				attributes: validatedAttributes,
			},
		})
		const [updatedDesign] = await prisma.$transaction([updateDesignFillPromise])

		return {
			success: true,
			updatedDesign,
		}
	} catch (error) {
		return {
			success: false,
			message: getOptionalZodErrorMessage(error),
		}
	}
}
