import { z } from 'zod'
import {
	type ReorderArtboardVersionLayerSchema,
	type NewArtboardVersionLayerSchema,
	type ToggleVisibleArtboardVersionLayerSchema,
	type DeleteArtboardVersionLayerSchema,
	type SelectArtboardVersionLayerSchema,
} from './layer-artboard-version'

type ObjectValues<T> = T[keyof T]
export const LayerCloneSourceTypeEnum = {
	ARTBOARD: 'artboard',
	ARTBOARD_VERSION: 'artboardVersion',
	LAYER: 'layer',
} as const
export type layerCloneSourceTypeEnum = ObjectValues<
	typeof LayerCloneSourceTypeEnum
>

export const LayerNameSchema = z.string().min(1).max(40)
export const LayerDescriptionSchema = z.string().min(0).max(400).optional()

export const EditLayerNameSchema = z.object({
	id: z.string(),
	name: LayerNameSchema,
})

export const EditLayerDescriptionSchema = z.object({
	id: z.string(),
	description: LayerDescriptionSchema,
})

// later there will be layer groups
export type NewLayerSchemaType = typeof NewArtboardVersionLayerSchema

export type ReorderLayerSchemaType = typeof ReorderArtboardVersionLayerSchema

export type ToggleVisibleLayerSchemaType =
	typeof ToggleVisibleArtboardVersionLayerSchema

export type DeleteLayerSchemaType = typeof DeleteArtboardVersionLayerSchema

export type SelectLayerSchemaType = typeof SelectArtboardVersionLayerSchema

export type selectArgsType = z.infer<typeof selectArgs>
const selectArgs = z.object({
	id: z.boolean().optional(),
})

export type whereArgsType = z.infer<typeof whereArgs>
const zodStringOrNull = z.union([z.string(), z.null()])
const whereArgs = z.object({
	id: z.string().optional(),
	ownerId: z.string().optional(),
	artboardId: z.string().optional(),
	artboardVersionId: z.string().optional(),
	prevId: zodStringOrNull.optional(),
	nextId: zodStringOrNull.optional(),
})

export type findLayerArgsType = z.infer<typeof findLayerArgs>
export const findLayerArgs = z.object({
	where: whereArgs,
	select: selectArgs.optional(),
})
