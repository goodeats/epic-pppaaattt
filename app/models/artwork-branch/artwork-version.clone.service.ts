import { invariant } from '@epic-web/invariant'
import { LinkedListNodeTypeEnum } from '#app/models/__shared/linked-list.definitions'
import { connectNodes } from '#app/models/__shared/linked-list.node.update.server'
import { type IUser } from '#app/models/user/user.server'
import { prisma } from '#app/utils/db.server'
import { getOptionalZodErrorMessage } from '#app/utils/misc'
import { orderLinkedItems } from '../__shared/linked-list.utils'
import {
	type IArtworkVersionCreatedResponse,
	createArtworkVersion,
	incrementVersionNameString,
} from '../artwork-version/artwork-version.create.server'
import { deleteArtworkVersions } from '../artwork-version/artwork-version.delete.server'
import {
	getArtworkVersions,
	verifyArtworkVersion,
} from '../artwork-version/artwork-version.get.server'
import { type IArtworkVersion } from '../artwork-version/definitions'
import { cloneDesignsToArtworkVersionService } from '../artwork-version/design/clone.service'
import { cloneLayersToArtworkVersionService } from '../artwork-version/layer/clone.service'
import { type IDesignsClonedResponse } from '../design/definitions.clone'
import { findManyDesignsWithType } from '../design/design.get.server'
import { getLayersWithChildren } from '../layer/layer.get.server'
import { verifyArtworkBranch } from './_.get.server'
import { type IArtworkBranchArtworkVersionCloneSubmission } from './artwork-version.clone.definitions'
import { type IArtworkBranchArtworkVersionCreateData } from './artwork-version.create.definitions'
import { ArtworkBranchArtworkVersionSchema } from './artwork-version.schema'

export const cloneArtworkBranchArtworkVersionService = async ({
	userId,
	id,
	branchId,
	description,
}: IArtworkBranchArtworkVersionCloneSubmission): Promise<IArtworkVersionCreatedResponse> => {
	try {
		// Step 1: verify the artwork version exists
		const artworkVersion = await verifyArtworkVersion({
			where: { id, ownerId: userId },
		})
		invariant(artworkVersion, 'Artwork version not found')

		// Step 2: verify the artwork branch exists
		await verifyArtworkBranch({
			where: { id: branchId, ownerId: userId },
		})

		// Step 3: delete all artwork versions after current
		// Step 3.1: get artwork versions for branch first
		// so that delete promise is not returned from an async function
		// before transaction can take place
		const artworkVersions = await getArtworkVersions({
			where: { branchId },
		})
		const deleteArtworkVersionsAfterCurrentPromise =
			deleteArtworkVersionsAfterCurrent({
				id,
				artworkVersions,
			})

		// Step 3: get data for cloned artwork version
		const validatedArtworkVersionData = validateArtworkVersionData({
			artworkVersion,
			userId,
			description,
		})

		// Step 4: clone the artwork version via promise
		const cloneArtworkVersionPromise = createArtworkVersion({
			data: validatedArtworkVersionData,
		})

		// Step 5: execute the clone transactions
		const [, clonedArtworkVersion] = await prisma.$transaction([
			deleteArtworkVersionsAfterCurrentPromise,
			cloneArtworkVersionPromise,
		])

		// Step 6: connect new node to current node
		const connectNodesPromise = connectNodes({
			type: LinkedListNodeTypeEnum.ARTWORK_VERSION,
			prevId: artworkVersion.id,
			nextId: clonedArtworkVersion.id,
		})
		await prisma.$transaction(connectNodesPromise)

		// Step 7: clone designs from prev artwork version
		await cloneDesignsToArtworkVersion({
			userId,
			artworkVersion,
			clonedArtworkVersion,
		})

		// Step 8: clone layers from prev artwork version
		await cloneLayersToArtworkVersion({
			userId,
			artworkVersion,
			clonedArtworkVersion,
		})

		return {
			createdArtworkVersion: clonedArtworkVersion,
			success: true,
		}
	} catch (error) {
		return {
			success: false,
			message: getOptionalZodErrorMessage(error),
		}
	}
}

const deleteArtworkVersionsAfterCurrent = ({
	id,
	artworkVersions,
}: {
	id: IArtworkVersion['id']
	artworkVersions: IArtworkVersion[]
}) => {
	// Step 2: reorder the artwork versions as linked list
	const orderedArtworkVersions =
		orderLinkedItems<IArtworkVersion>(artworkVersions)

	// Step 3: find the index of the current artwork version
	const currentIndex = orderedArtworkVersions.findIndex(
		(artworkVersion) => artworkVersion.id === id,
	)

	// Step 4: get the id's of the artwork versions after the current index
	const idsToDelete = orderedArtworkVersions
		.slice(currentIndex + 1)
		.map((artworkVersion) => artworkVersion.id)

	// Step 5: return the promise that deletes them
	return deleteArtworkVersions({
		ids: idsToDelete,
	})
}

const validateArtworkVersionData = ({
	artworkVersion,
	userId,
	description,
}: {
	artworkVersion: IArtworkVersion
	userId: IUser['id']
	description: string
}): IArtworkBranchArtworkVersionCreateData => {
	// Step 1: build the artwork version clone data
	const {
		name,
		width,
		height,
		background,
		watermark,
		watermarkColor,
		branchId,
	} = artworkVersion
	const newName = incrementVersionNameString(name)
	const artworkVersionData = {
		name: newName,
		slug: newName,
		description: description || 'new version',
		width,
		height,
		background,
		watermark,
		watermarkColor,
		ownerId: userId,
		branchId,
	}
	// Step 3: validate the design data with the schema
	return ArtworkBranchArtworkVersionSchema.parse(artworkVersionData)
}

const cloneDesignsToArtworkVersion = async ({
	userId,
	artworkVersion,
	clonedArtworkVersion,
}: {
	userId: IUser['id']
	artworkVersion: IArtworkVersion
	clonedArtworkVersion: IArtworkVersion
}): Promise<IDesignsClonedResponse> => {
	const designs = await findManyDesignsWithType({
		where: { artworkVersionId: artworkVersion.id },
	})
	return await cloneDesignsToArtworkVersionService({
		userId,
		artworkVersionId: clonedArtworkVersion.id,
		designs,
	})
}

const cloneLayersToArtworkVersion = async ({
	userId,
	artworkVersion,
	clonedArtworkVersion,
}: {
	userId: IUser['id']
	artworkVersion: IArtworkVersion
	clonedArtworkVersion: IArtworkVersion
}) => {
	const layers = await getLayersWithChildren({
		where: { artworkVersionId: artworkVersion.id },
	})
	return await cloneLayersToArtworkVersionService({
		userId,
		artworkVersionId: clonedArtworkVersion.id,
		layers,
	})
}
