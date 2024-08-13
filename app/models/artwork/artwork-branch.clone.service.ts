import { invariant } from '@epic-web/invariant'
import { type IUser } from '#app/models/user/user.server'
import { prisma } from '#app/utils/db.server'
import { getOptionalZodErrorMessage, stringToSlug } from '#app/utils/misc'
import { type IArtworkBranch } from '../artwork-branch/_._definitions'
import { createArtworkBranch } from '../artwork-branch/_.create.db.server'
import { verifyArtworkBranch } from '../artwork-branch/_.get.server'
import { verifyArtworkVersion } from '../artwork-version/artwork-version.get.server'
import { ArtworkArtworkBranchSchema } from './artwork-branch._schema'
import { type IArtworkArtworkBranchCloneSubmission } from './artwork-branch.clone.definitions'
import { type IArtworkArtworkBranchCreateData } from './artwork-branch.create.definitions'
import { verifyArtwork } from './artwork.get.server'

export const cloneArtworkArtworkBranchService = async ({
	userId,
	id,
	artworkId,
	versionId,
	name,
	description,
}: IArtworkArtworkBranchCloneSubmission): Promise<IArtworkVersionCreatedResponse> => {
	try {
		// Step 1: verify the artwork branch exists
		const artworkBranch = await verifyArtworkBranch({
			where: { id, ownerId: userId },
		})
		invariant(artworkBranch, 'Artwork branch not found')

		// Step 2: verify the artwork exists and belongs to the artwork branch
		if (artworkBranch.artworkId !== artworkId) {
			invariant(false, 'Artwork not found')
		}
		await verifyArtwork({
			where: { id: artworkId, ownerId: userId },
		})
		// Step 2.1: verify the artwork version exists and belongs to the artwork branch
		const artworkVersion = await verifyArtworkVersion({
			where: { id: versionId, ownerId: userId },
		})
		if (!artworkVersion || artworkVersion.branchId !== artworkBranch.id) {
			invariant(false, 'Artwork version not found')
		}

		// Step 3: get data for cloned artwork branch
		const validatedArtworkBranchData = validateArtworkBranchData({
			userId,
			artworkBranch,
			name,
			description,
		})

		// Step 4: clone the artwork version via promise
		const cloneArtworkBranchPromise = createArtworkBranch({
			data: validatedArtworkBranchData,
		})

		// Step 5: execute the transactions
		const [clonedArtworkBranch] = await prisma.$transaction([
			cloneArtworkBranchPromise,
		])

		return {
			createdArtworkBranch: clonedArtworkBranch,
			success: true,
		}
	} catch (error) {
		return {
			success: false,
			message: getOptionalZodErrorMessage(error),
		}
	}
}

const validateArtworkBranchData = ({
	userId,
	artworkBranch,
	name,
	description,
}: {
	artworkBranch: IArtworkBranch
	userId: IUser['id']
	name: string
	description: string
}): IArtworkArtworkBranchCreateData => {
	// Step 1: build the artwork branch clone data
	const artworkBranchData = {
		name,
		slug: stringToSlug(name),
		description: description || `New branch from ${artworkBranch.name}`,
		ownerId: userId,
		artworkId: artworkBranch.artworkId,
		parentId: artworkBranch.id,
	}
	// Step 3: validate the design data with the schema
	return ArtworkArtworkBranchSchema.parse(artworkBranchData)
}
