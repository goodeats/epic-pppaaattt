import { invariant } from '@epic-web/invariant'
import { type z } from 'zod'
import { AssetTypeEnum } from '#app/schema/asset'
import { prisma } from '#app/utils/db.server'
import { deserializeAsset } from '../utils'
import { type IAssetImage } from './image.server'

export type queryAssetImageWhereArgsType = z.infer<
	z.ZodObject<{
		id: z.ZodOptional<z.ZodString>
		ownerId: z.ZodOptional<z.ZodString>
		artworkId: z.ZodOptional<z.ZodString>
		artworkVersionId: z.ZodOptional<z.ZodString>
		layerId: z.ZodOptional<z.ZodString>
	}>
>

// TODO: Add schemas for each type of query and parse with zod
// aka if by id that should be present, if by slug that should be present
// owner id should be present unless admin (not set up yet)
const validateQueryWhereArgsPresent = (where: queryAssetImageWhereArgsType) => {
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
			'Null or undefined values are not allowed in query parameters for asset image.',
		)
	}
}

export const getAssetImage = async ({
	where,
}: {
	where: queryAssetImageWhereArgsType
}): Promise<IAssetImage | null> => {
	validateQueryWhereArgsPresent(where)
	const asset = await prisma.asset.findFirst({
		where: {
			...where,
			type: AssetTypeEnum.IMAGE,
		},
	})
	invariant(asset, 'Asset Image Not found')
	return deserializeAsset({ asset }) as IAssetImage
}
