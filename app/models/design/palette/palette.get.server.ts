import { invariant } from '@epic-web/invariant'
import { type z } from 'zod'
import { DesignTypeEnum } from '#app/models/design/definitions'
import { prisma } from '#app/utils/db.server'
import { deserializeDesign } from '../utils'
import { type IDesignPalette } from './palette.server'

export type queryWhereArgsType = z.infer<
	z.ZodObject<{
		id: z.ZodOptional<z.ZodString>
		ownerId: z.ZodOptional<z.ZodString>
		artworkVersionId: z.ZodOptional<z.ZodString>
		layerId: z.ZodOptional<z.ZodString>
	}>
>

// TODO: Add schemas for each type of query and parse with zod
// aka if by id that should be present, if by slug that should be present
// owner id should be present unless admin (not set up yet)
const validateQueryWhereArgsPresent = (where: queryWhereArgsType) => {
	const nullValuesAllowed: string[] = []
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
			'Null or undefined values are not allowed in query parameters for design palette.',
		)
	}
}

export const getDesignPalette = async ({
	where,
}: {
	where: queryWhereArgsType
}): Promise<IDesignPalette | null> => {
	validateQueryWhereArgsPresent(where)
	const design = await prisma.design.findFirst({
		where: {
			...where,
			type: DesignTypeEnum.PALETTE,
		},
	})
	invariant(design, 'Design Palette Not found')
	return deserializeDesign({ design }) as IDesignPalette
}
