import { prisma } from '#app/utils/db.server'
import { type IArtwork } from '../artwork/artwork.server'
import { type IUser } from '../user/user.server'
import {
	type IArtworkBranch,
	type IArtworkBranchWithVersions,
} from './_._definitions'

export interface IArtworkBranchCreatedResponse {
	success: boolean
	message?: string
	createdArtworkBranch?: IArtworkBranch
}

export const createArtworkBranch = ({
	data,
}: {
	data: {
		ownerId: IUser['id']
		artworkId: IArtwork['id']
		parentId?: IArtworkBranch['id']
		name: string
		slug: string
		description: string | null | undefined
	}
}) => {
	return prisma.artworkBranch.create({
		data,
	})
}

export const createDefaultArtworkBranchWithVersion = async ({
	artwork,
}: {
	artwork: Pick<IArtwork, 'id' | 'ownerId'>
}): Promise<IArtworkBranchWithVersions> => {
	const { ownerId } = artwork

	const artworkBranch = await prisma.artworkBranch.create({
		data: {
			artwork: {
				connect: {
					id: artwork.id,
				},
			},
			owner: {
				connect: {
					id: ownerId,
				},
			},
			default: true,
			versions: {
				create: {
					owner: {
						connect: {
							id: ownerId,
						},
					},
				},
			},
		},
		include: {
			versions: true,
		},
	})
	return artworkBranch
}
