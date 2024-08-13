import { z } from 'zod'
import { DesignTypeEnum } from '#app/models/design/definitions'
import { arrayOfIds, zodStringOrNull } from '#app/schema/zod-helpers'
import { prisma } from '#app/utils/db.server'
import {
	type IDesignParsed,
	type IDesign,
	type IDesignWithType,
} from '../design/definitions'
import { deserializeDesigns } from './utils'
import { invariant } from '@epic-web/invariant'

export type queryDesignWhereArgsType = z.infer<typeof whereArgs>
const whereArgs = z.object({
	id: z.union([z.string(), arrayOfIds]).optional(),
	type: z.nativeEnum(DesignTypeEnum).optional(),
	visible: z.boolean().optional(),
	selected: z.boolean().optional(),
	ownerId: z.string().optional(),
	artworkId: z.string().optional(),
	artworkVersionId: z.string().optional(),
	layerId: z.string().optional(),
	nextId: zodStringOrNull.optional(),
	prevId: zodStringOrNull.optional(),
})

// no ordering for now since these are linked lists
const designTypes = {
	palette: true,
	size: true,
	fill: true,
	stroke: true,
	line: true,
	rotate: true,
	layout: true,
	template: true,
}

// TODO: Add schemas for each type of query and parse with zod
// aka if by id that should be present, if by slug that should be present
// owner id should be present unless admin (not set up yet)
export const validateQueryWhereArgsPresent = (
	where: queryDesignWhereArgsType,
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
			'Null or undefined values are not allowed in query parameters for design.',
		)
	}
}

export const getDesigns = ({
	where,
}: {
	where: queryDesignWhereArgsType
}): Promise<IDesign[]> => {
	validateQueryWhereArgsPresent(where)
	return prisma.design.findMany({
		where,
	})
}

export const getDesignsCount = ({
	where,
}: {
	where: queryDesignWhereArgsType
}): Promise<number> => {
	validateQueryWhereArgsPresent(where)
	return prisma.design.count({
		where,
	})
}

export const getDesignsWithType = ({
	where,
}: {
	where: queryDesignWhereArgsType
}): Promise<IDesignWithType[]> => {
	validateQueryWhereArgsPresent(where)
	return prisma.design.findMany({
		where,
		include: designTypes,
	})
}

export const getDesign = ({ where }: { where: queryDesignWhereArgsType }) => {
	validateQueryWhereArgsPresent(where)
	return prisma.design.findFirst({
		where,
	})
}

export const verifyDesign = async ({
	where,
}: {
	where: queryDesignWhereArgsType
}) => {
	validateQueryWhereArgsPresent(where)
	const design = await prisma.design.findFirst({
		where,
	})
	invariant(design, 'Design not found')
	return design
}

export const getDesignWithType = ({
	where,
}: {
	where: queryDesignWhereArgsType
}): Promise<IDesignWithType | null> => {
	validateQueryWhereArgsPresent(where)
	return prisma.design.findFirst({
		where,
		include: designTypes,
	})
}

export const findManyDesignsWithType = async ({
	where,
}: {
	where: queryDesignWhereArgsType
}): Promise<IDesignParsed[]> => {
	validateQueryWhereArgsPresent(where)
	const designs = await prisma.design.findMany({
		where,
	})

	return deserializeDesigns({
		designs,
	})
}
