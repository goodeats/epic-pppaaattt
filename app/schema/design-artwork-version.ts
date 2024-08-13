import { DesignTypeEnum, designTypeEnum } from '#app/models/design/definitions'
import { z } from 'zod'

export interface DesignArtworkVersion {
	type: designTypeEnum
	ownerId: string
	artworkVersionId: string
}

export const ArtworkVersionDesignDataCreateSchema = z.object({
	type: z.nativeEnum(DesignTypeEnum),
	ownerId: z.string(),
	artworkVersionId: z.string(),
	visible: z.boolean().optional(),
	selected: z.boolean().optional(),
}) satisfies z.Schema<DesignArtworkVersion>

export const DeleteArtworkVersionDesignSchema = z.object({
	id: z.string(),
	artworkVersionId: z.string(),
})

export const ToggleVisibleArtworkVersionDesignSchema = z.object({
	id: z.string(),
	artworkVersionId: z.string(),
})

export const ReorderArtworkVersionDesignSchema = z.object({
	id: z.string(),
	artworkVersionId: z.string(),
	direction: z.enum(['up', 'down']),
})
