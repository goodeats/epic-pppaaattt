import { invariant } from '@epic-web/invariant'
import { z } from 'zod'
import { prisma } from '#app/utils/db.server'
import {
	type IArtworkWithProject,
	type IArtwork,
	type IArtworkWithBranchesAndVersions,
	type IArtworkWithAssets,
} from '../artwork/artwork.server'
import { assetSelect } from '../asset/asset.get.server'
import { deserializeAssets } from '../asset/utils'

export type queryArtworkWhereArgsType = z.infer<typeof whereArgs>
const whereArgs = z.object({
	id: z.string().optional(),
	ownerId: z.string().optional(),
	slug: z.string().optional(),
})

// TODO: Add schemas for each type of query and parse with zod
// aka if by id that should be present, if by slug that should be present
// owner id should be present unless admin (not set up yet)
const validateQueryWhereArgsPresent = (where: queryArtworkWhereArgsType) => {
	if (Object.values(where).some(value => !value)) {
		throw new Error(
			'Null or undefined values are not allowed in query parameters for artwork.',
		)
	}
}

export const getArtwork = async ({
	where,
}: {
	where: queryArtworkWhereArgsType
}): Promise<IArtwork | null> => {
	validateQueryWhereArgsPresent(where)
	const artwork = await prisma.artwork.findFirst({
		where,
	})
	return artwork
}

export const verifyArtwork = async ({
	where,
}: {
	where: queryArtworkWhereArgsType
}): Promise<IArtwork | null> => {
	validateQueryWhereArgsPresent(where)
	const artwork = await prisma.artwork.findFirst({
		where,
	})
	invariant(artwork, 'Artwork not found')
	return artwork
}

export const getArtworkWithBranchesAndVersions = async ({
	where,
}: {
	where: queryArtworkWhereArgsType
}): Promise<IArtworkWithBranchesAndVersions | null> => {
	validateQueryWhereArgsPresent(where)
	const artwork = await prisma.artwork.findFirst({
		where,
		include: {
			branches: {
				include: {
					versions: true,
				},
			},
		},
	})
	return artwork
}

export const getArtworkWithProject = async ({
	where,
}: {
	where: queryArtworkWhereArgsType
}): Promise<IArtworkWithProject | null> => {
	validateQueryWhereArgsPresent(where)
	const artwork = await prisma.artwork.findFirst({
		where,
		include: {
			project: {
				include: {
					artworks: true,
				},
			},
		},
	})
	return artwork
}

export const getArtworkWithAssets = async ({
	where,
}: {
	where: queryArtworkWhereArgsType
}): Promise<IArtworkWithAssets | null> => {
	validateQueryWhereArgsPresent(where)
	const artwork = await prisma.artwork.findFirst({
		where,
		include: {
			assets: {
				select: assetSelect,
			},
		},
	})
	invariant(artwork, 'Artwork not found')

	const validatedAssets = deserializeAssets({ assets: artwork.assets })
	return { ...artwork, assets: validatedAssets }
}
