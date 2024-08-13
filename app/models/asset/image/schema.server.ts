import { z } from 'zod'
import { ArtworkVersionParentSchema } from '#app/models/artwork-version/schema'
import {
	AssetDescriptionSchema,
	AssetNameSchema,
} from '#app/schema/asset/__shared'
import {
	ACCEPTED_IMAGE_TYPES,
	AltTextSchema,
	MAX_UPLOAD_SIZE,
} from '#app/schema/asset/image'
import { ArtworkParentSchema } from '#app/schema/asset/image.artwork'
import { LayerParentSchema } from '#app/schema/asset/image.layer'

const FileServerSchema = z
	.instanceof(File)
	.refine(file => file.size > 0, 'Image is required')
	.refine(
		file => file.size <= MAX_UPLOAD_SIZE,
		'Image size must be less than 3MB',
	)
	.refine(
		file => ACCEPTED_IMAGE_TYPES.includes(file.type),
		'Image must be a JPEG, PNG, WEBP, or GIF',
	)

export const NewAssetImageServerSchema = z.object({
	file: FileServerSchema,
	name: AssetNameSchema,
	description: AssetDescriptionSchema,
	altText: AltTextSchema,
})

export const NewAssetImageArtworkServerSchema =
	NewAssetImageServerSchema.merge(ArtworkParentSchema)

export const NewAssetImageArtworkVersionServerSchema =
	NewAssetImageServerSchema.merge(ArtworkVersionParentSchema)

export const NewAssetImageLayerServerSchema =
	NewAssetImageServerSchema.merge(LayerParentSchema)
