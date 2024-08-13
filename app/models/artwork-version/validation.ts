import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { DeleteArtworkVersionDesignSchema } from '#app/schema/design-artwork-version'
import { NewArtworkVersionLayerSchema } from '#app/schema/layer-artwork-version'
import { ValidateArtworkVersionParentSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntitySubmission } from '#app/utils/conform-utils'
import { NewArtworkVersionDesignSchema } from './design/schema.create'
import {
	UpdateArtworkVersionDesignFieldSchema,
	UpdateArtworkVersionDesignReorderSchema,
} from './design/schema.update'

type ArtworkVersionParentSchema =
	| typeof NewArtworkVersionDesignSchema
	| typeof UpdateArtworkVersionDesignFieldSchema
	| typeof DeleteArtworkVersionDesignSchema
	| typeof UpdateArtworkVersionDesignReorderSchema
	| typeof NewArtworkVersionLayerSchema

export const validateArtworkVersionParentSubmission = async (
	{ userId, formData }: IntentActionArgs,
	schema: ArtworkVersionParentSchema,
) => {
	const strategy = new ValidateArtworkVersionParentSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema,
		strategy,
	})
}
