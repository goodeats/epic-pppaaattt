import { invariant } from '@epic-web/invariant'
import { type z } from 'zod'
import { type DesignTypeEnum } from '#app/models/design/definitions'
import { prisma } from '#app/utils/db.server'
import {
	type IDesignParsed,
	type IDesign,
	type IDesignWithType,
} from '../design/definitions'
import { deserializeDesigns } from './utils'

export type queryDesignWhereArgsType = z.infer<
	z.ZodObject<{
		id: z.ZodOptional<
			z.ZodUnion<[z.ZodString, z.ZodObject<{ in: z.ZodArray<z.ZodString> }>]>
		>
		type: z.ZodOptional<z.ZodNativeEnum<typeof DesignTypeEnum>>
		visible: z.ZodOptional<z.ZodBoolean>
		selected: z.ZodOptional<z.ZodBoolean>
		ownerId: z.ZodOptional<z.ZodString>
		artworkId: z.ZodOptional<z.ZodString>
		artworkVersionId: z.ZodOptional<z.ZodString>
		layerId: z.ZodOptional<z.ZodString>
		nextId: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNull]>>
		prevId: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNull]>>
	}>
>

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
