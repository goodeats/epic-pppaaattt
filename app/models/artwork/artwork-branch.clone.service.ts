import { invariant } from '@epic-web/invariant'
import { type IUser } from '#app/models/user/user.server'
import { prisma } from '#app/utils/db.server'
import { getOptionalZodErrorMessage, stringToSlug } from '#app/utils/misc'
import { type IArtworkBranch } from '../artwork-branch/_._definitions'
import {
	createArtworkBranch,
	type IArtworkBranchCreatedResponse,
} from '../artwork-branch/_.create.db.server'
import { verifyArtworkBranch } from '../artwork-branch/_.get.server'
import { cloneArtworkVersionsToArtworkBranchService } from '../artwork-branch/artwork-versions.clone.service'
import { getArtworkVersionsWithChildren } from '../artwork-version/artwork-version.get.server'
import { ArtworkArtworkBranchSchema } from './artwork-branch._schema'
import { type IArtworkArtworkBranchCloneSubmission } from './artwork-branch.clone.definitions'
import { type IArtworkArtworkBranchCreateData } from './artwork-branch.create.definitions'
import { verifyArtwork } from './artwork.get.server'

export const cloneArtworkArtworkBranchService = async ({
	userId,
	id,
	artworkId,
	name,
	description,
}: IArtworkArtworkBranchCloneSubmission): Promise<IArtworkBranchCreatedResponse> => {
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

		// Step 6: clone artwork versions from prev artwork branch
		await cloneArtworkVersionsToArtworkBranch({
			userId,
			artworkBranch,
			clonedArtworkBranch,
		})

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

const cloneArtworkVersionsToArtworkBranch = async ({
	userId,
	artworkBranch,
	clonedArtworkBranch,
}: {
	userId: IUser['id']
	artworkBranch: IArtworkBranch
	clonedArtworkBranch: IArtworkBranch
}) => {
	const artworkVersions = await getArtworkVersionsWithChildren({
		where: { branchId: artworkBranch.id },
	})
	return await cloneArtworkVersionsToArtworkBranchService({
		userId,
		artworkBranchId: clonedArtworkBranch.id,
		artworkVersions,
	})
}
