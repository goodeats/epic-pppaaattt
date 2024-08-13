import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { EditAssetImageFitSchema } from '#app/schema/asset/image'
import { ValidateAssetSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntitySubmission } from '#app/utils/conform-utils'
import { type IAssetUpdateData, type IAsset } from '../asset.server'
import {
	type IAssetImageSubmission,
	type IAssetAttributesImage,
	type IAssetImage,
} from './image.server'

export interface IAssetImageUpdatedResponse {
	success: boolean
	message?: string
	updatedAssetImage?: IAsset
}

export interface IAssetImageUpdateSubmission extends IAssetImageSubmission {
	id: IAssetImage['id']
	blob?: Buffer
}

export interface IAssetImageUpdateData extends IAssetUpdateData {
	attributes: IAssetAttributesImage
}

export const validateEditAssetImageSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateAssetSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema: EditAssetImageFitSchema,
		strategy,
	})
}
