import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { NewArtworkVersionLayerSchema } from '#app/schema/layer-artwork-version'
import { ValidateArtworkVersionParentSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntitySubmission } from '#app/utils/conform-utils'
import { prisma } from '#app/utils/db.server'
import { type ILayer } from '../layer/definitions'
import { type ILayerParentCreateData } from './definitions.create'

export interface ILayerCreatedResponse {
	success: boolean
	message?: string
	createdLayer?: ILayer
}

export const validateArtworkVersionNewLayerSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateArtworkVersionParentSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema: NewArtworkVersionLayerSchema,
		strategy,
	})
}

export const createLayer = ({ data }: { data: ILayerParentCreateData }) => {
	return prisma.layer.create({ data })
}
