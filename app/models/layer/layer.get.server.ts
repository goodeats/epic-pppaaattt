import { invariant } from '@epic-web/invariant'
import { z } from 'zod'
import { type findLayerArgsType, type whereArgsType } from '#app/schema/layer'
import { arrayOfIds, zodStringOrNull } from '#app/schema/zod-helpers'
import { prisma } from '#app/utils/db.server'
import { assetSelect } from '../asset/asset.get.server'
import { deserializeAssets } from '../asset/utils'
import { deserializeDesigns } from '../design/utils'
import {
	type ILayerWithChildren,
	type ILayer,
	type ILayerWithDesigns,
} from '../layer/definitions'

export type queryLayerWhereArgsType = z.infer<typeof whereArgs>
const whereArgs = z.object({
	id: z.union([z.string(), arrayOfIds]).optional(),
	visible: z.boolean().optional(),
	selected: z.boolean().optional(),
	ownerId: z.string().optional(),
	artworkVersionId: z.string().optional(),
	nextId: zodStringOrNull.optional(),
	prevId: zodStringOrNull.optional(),
})

// TODO: Add schemas for each type of query and parse with zod
// aka if by id that should be present, if by slug that should be present
// owner id should be present unless admin (not set up yet)
export const validateQueryWhereArgsPresent = (
	where: queryLayerWhereArgsType,
) => {
	const nullValuesAllowed = ['nextId', 'prevId']
	const missingValues: Record<string, any> = {}
	for (const [key, value] of Object.entries(where)) {
		const valueIsNull = value === null || value === undefined
		const nullValueAllowed = nullValuesAllowed.includes(key)
		if (valueIsNull && !nullValueAllowed) {
			missingValues[key] = value
		}
	}

	if (Object.keys(missingValues).length > 0) {
		console.log('Missing values:', missingValues)
		throw new Error(
			'Null or undefined values are not allowed in query parameters for layer.',
		)
	}
}

export const getLayersCount = ({
	where,
}: {
	where: queryLayerWhereArgsType
}): Promise<number> => {
	validateQueryWhereArgsPresent(where)
	return prisma.layer.count({
		where,
	})
}

export const getLayersWithDesigns = async ({
	where,
}: {
	where: whereArgsType
}): Promise<ILayerWithDesigns[]> => {
	const layers = await prisma.layer.findMany({
		where,
		include: {
			designs: {
				include: {
					palette: true,
					size: true,
					fill: true,
					stroke: true,
					line: true,
					rotate: true,
					layout: true,
					template: true,
				},
			},
		},
	})
	return layers
}

export const getLayersWithChildren = async ({
	where,
}: {
	where: whereArgsType
}): Promise<ILayerWithChildren[]> => {
	const layers = await prisma.layer.findMany({
		where,
		include: {
			assets: {
				select: assetSelect,
			},
			designs: true,
		},
	})

	return layers.map(layer => {
		const validatedAssets = deserializeAssets({ assets: layer.assets })
		const validatedDesigns = deserializeDesigns({ designs: layer.designs })
		return { ...layer, assets: validatedAssets, designs: validatedDesigns }
	})
}

export const getLayer = ({ where }: { where: whereArgsType }) => {
	return prisma.layer.findFirst({
		where,
	})
}

export const verifyLayer = async ({
	where,
}: {
	where: queryLayerWhereArgsType
}) => {
	validateQueryWhereArgsPresent(where)
	const layer = await prisma.layer.findFirst({
		where,
	})
	invariant(layer, 'Layer not found')
	return layer
}

export const findFirstLayer = async ({
	where,
	select,
}: findLayerArgsType): Promise<ILayer | null> => {
	return await prisma.layer.findFirst({
		where,
		select,
	})
}
