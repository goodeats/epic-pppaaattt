import { type ZodType, z } from 'zod'
import {
	IArtworkVersionData,
	type IArtworkVersionParentData,
} from './definitions'
import { HexcodeSchema } from '#app/schema/colors'

const widthMinLength = 1
const widthMaxLength = 50000
const heightMinLength = 1
const heightMaxLength = 50000

const widthSchema = z
	.number()
	.min(widthMinLength, {
		message: `Width must be at least ${widthMinLength}`,
	})
	.max(widthMaxLength, {
		message: `Width must be at most ${widthMaxLength}`,
	})

const heightSchema = z
	.number()
	.min(heightMinLength, {
		message: `Height must be at least ${heightMinLength}`,
	})
	.max(heightMaxLength, {
		message: `Height must be at most ${heightMaxLength}`,
	})

export const ArtworkVersionDataSchema = z.object({
	name: z.string(),
	slug: z.string(),
	description: z.string(),
	watermark: z.boolean().optional(),
	watermarkColor: HexcodeSchema.optional(),
	width: widthSchema.optional(),
	height: heightSchema.optional(),
	background: HexcodeSchema.optional(),
	ownerId: z.string(),
}) satisfies z.Schema<IArtworkVersionData>

export const ArtworkVersionParentSchema = z.object({
	artworkVersionId: z.string(),
}) satisfies ZodType<IArtworkVersionParentData>
