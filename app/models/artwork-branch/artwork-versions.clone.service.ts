import { type PrismaPromise } from '@prisma/client'
import { LinkedListNodeTypeEnum } from '#app/models/__shared/linked-list.definitions'
import { type IUser } from '#app/models/user/user.server'
import { prisma } from '#app/utils/db.server.js'
import { getOptionalZodErrorMessage } from '#app/utils/misc'
import { connectUnlinkedNodes } from '../__shared/linked-list.node.update.server'
import { getArtworkVersionData } from '../artwork-version/_._utils'
import { type IArtworkVersionsClonedResponse } from '../artwork-version/_.clone.definitions'
import { createArtworkVersion } from '../artwork-version/artwork-version.create.server'
import {
	type IArtworkVersion,
	type IArtworkVersionWithChildren,
} from '../artwork-version/definitions'
import { cloneDesignsToArtworkVersionService } from '../artwork-version/design/clone.service'
import { cloneLayersToArtworkVersionService } from '../artwork-version/layer/clone.service'
import { type IArtworkBranch } from './_._definitions'
import { type IArtworkBranchArtworkVersionCreateData } from './artwork-version.create.definitions'
import { ArtworkBranchArtworkVersionSchema } from './artwork-version.schema'
import { type IArtworkBranchArtworkVersionsCloneSubmission } from './artwork-versions.clone.definitions'

export const cloneArtworkVersionsToArtworkBranchService = async ({
	userId,
	artworkBranchId,
	artworkVersions,
}: IArtworkBranchArtworkVersionsCloneSubmission): Promise<IArtworkVersionsClonedResponse> => {
	try {
		// Step 1: Prepare artwork version create data list
		const cloneDataList = prepareCloneDataList({
			userId,
			branchId: artworkBranchId,
			artworkVersions,
		})

		// Step 2: Create cloned artwork versions in order
		const clonePromises = prepareClonePromises({
			cloneDataList,
		})
		const clonedArtworkVersions = await prisma.$transaction(clonePromises)

		// Step 3: Prepare artwork version update promises
		// e.g. re-link the cloned artwork versions
		const updateClonedPromises = connectUnlinkedNodes({
			items: clonedArtworkVersions,
			type: LinkedListNodeTypeEnum.ARTWORK_VERSION,
		})
		await prisma.$transaction(updateClonedPromises)

		// Step 4: clone children for each cloned artwork version
		await cloneChildrenToClonedArtworkVersions({
			userId,
			artworkVersions,
			clonedArtworkVersions,
		})

		return { success: true }
	} catch (error) {
		return {
			success: false,
			message: getOptionalZodErrorMessage(error),
		}
	}
}

const validateCloneData = ({
	cloneData,
}: {
	cloneData: IArtworkBranchArtworkVersionCreateData
}) => {
	return ArtworkBranchArtworkVersionSchema.parse(cloneData)
}

const prepareCloneDataList = ({
	userId,
	branchId,
	artworkVersions,
}: {
	userId: IUser['id']
	branchId: IArtworkBranch['id']
	artworkVersions: IArtworkVersionWithChildren[]
}): IArtworkBranchArtworkVersionCreateData[] => {
	return artworkVersions.map((artworkVersion) =>
		validateCloneData({
			cloneData: {
				...getArtworkVersionData({
					artworkVersion,
				}),
				ownerId: userId,
				branchId,
			},
		}),
	)
}

const prepareClonePromises = ({
	cloneDataList,
}: {
	cloneDataList: IArtworkBranchArtworkVersionCreateData[]
}): PrismaPromise<IArtworkVersion>[] => {
	return cloneDataList.map((data) => createArtworkVersion({ data }))
}

const cloneChildrenToClonedArtworkVersions = async ({
	userId,
	artworkVersions,
	clonedArtworkVersions,
}: {
	userId: IUser['id']
	artworkVersions: IArtworkVersionWithChildren[]
	clonedArtworkVersions: IArtworkVersion[]
}) => {
	for (let i = 0; i < artworkVersions.length; i++) {
		const artworkVersion = artworkVersions[i]!
		const clonedArtworkVersion = clonedArtworkVersions[i]!

		await cloneDesignsToArtworkVersionService({
			userId,
			artworkVersionId: clonedArtworkVersion.id,
			designs: artworkVersion.designs,
		})

		await cloneLayersToArtworkVersionService({
			userId,
			artworkVersionId: clonedArtworkVersion.id,
			layers: artworkVersion.layers,
		})
	}
}
