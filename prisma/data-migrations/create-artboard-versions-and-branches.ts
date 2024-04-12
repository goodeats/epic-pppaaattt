import { getArtboardsWithDesignsAndLayers } from '#app/models/artboard/artboard.get.server'
import { type IArtboardVersion } from '#app/models/artboard-version.server'
import { type IArtboardWithDesignsAndLayers } from '#app/models/artboard.server'
import { artboardBranchCreateService } from '#app/routes/sketch+/artboards+/$slug_+/services/artboard/branch/create.service'
import { artboardVersionCloneDesignsService } from '#app/routes/sketch+/artboards+/$slug_+/services/artboard/version/clone-designs.service'
import { artboardVersionCloneLayersService } from '#app/routes/sketch+/artboards+/$slug_+/services/artboard/version/clone-layers.service'
import { DesignCloneSourceTypeEnum } from '#app/schema/design'
import { LayerCloneSourceTypeEnum } from '#app/schema/layer'
import { prisma } from '#app/utils/db.server'
import { getCountOfAllEntities } from '#app/utils/dev.utils'

// artboards will have version control now
// new prisma migration created the following tables:
// - ArtboardVersion, ArtboardBranch, ArtboardMergeRequest
// and the following changes to existing tables:
// - artboard: has many versions, branches, mergeRequests
// - layer: added artboardVersion, artboardBranch
// - design: added artboardVersion, artboardBranch

// the goal of this script:
// - for each artboard
// - - create a new version (latest)
// - - create a new branch (main)
// - - deep copy layers and designs to the new version and branch

// after this script runs, there is more work to do:
// - routing, ui, and api changes to support artboard versions and branches

// how to run:
// add the folowing to package.json scripts:
// "data:migrate": "npx vite-node ./prisma/data-migrations/create-artboard-versions-and-branches.ts"
// then run `npm run data:migrate`
// then remove the script from package.json

export const createArtboardVersionsBranches = async () => {
	console.log('createArtboardVersionsBranches begin 🎬')

	// Step 1: remove all artboard branches and versions from previous runs
	await clear()

	await getCountOfAllEntities()

	// Step 2: get all artboards
	// with their designs, layers, and layers' designs
	const artboards = await getArtboards()

	// Step 2: clone each artboard to a new version and branch
	for (const [, artboard] of artboards.entries()) {
		await cloneArtboard({ artboard })
	}

	console.log('createArtboardVersionsBranches end 🏁')
	await getCountOfAllEntities()
}

const clear = async () => {
	await prisma.artboardBranch.deleteMany()
	await prisma.artboardVersion.deleteMany()
}

const getArtboards = async (): Promise<IArtboardWithDesignsAndLayers[]> => {
	return await getArtboardsWithDesignsAndLayers()
}

const cloneArtboard = async ({
	artboard,
}: {
	artboard: IArtboardWithDesignsAndLayers
}) => {
	console.log('artboard: ', artboard.name)

	// Step 1: create a new branch and version
	const artboardVersions = await createArtboardBranchWithVersion({ artboard })

	// Step 2: clone artboard children to the new version
	for (const [, artboardVersion] of artboardVersions.entries()) {
		await cloneArtboardChildrenToVersion({ artboard, artboardVersion })
	}
}

const createArtboardBranchWithVersion = async ({
	artboard,
}: {
	artboard: IArtboardWithDesignsAndLayers
}): Promise<IArtboardVersion[]> => {
	const { artboardBranch } = await artboardBranchCreateService({
		artboard,
	})

	if (!artboardBranch) {
		throw new Error('createArtboardBranchWithVersion failed')
	}

	return artboardBranch.versions
}

const cloneArtboardChildrenToVersion = async ({
	artboard,
	artboardVersion,
}: {
	artboard: IArtboardWithDesignsAndLayers
	artboardVersion: IArtboardVersion
}) => {
	console.log('artboardVersion: ', artboardVersion.name, artboard.name)
	const cloneDesigns = await cloneArtboardDesignsToVersion({
		artboard,
		artboardVersion,
	})
	console.log('cloneDesigns: ', cloneDesigns)
	const cloneLayers = await cloneArtboardLayersToVersion({
		artboard,
		artboardVersion,
	})
	console.log('cloneLayers: ', cloneLayers)
}

const cloneArtboardDesignsToVersion = async ({
	artboard,
	artboardVersion,
}: {
	artboard: IArtboardWithDesignsAndLayers
	artboardVersion: IArtboardVersion
}) => {
	return await artboardVersionCloneDesignsService({
		userId: artboard.ownerId,
		sourceEntityType: DesignCloneSourceTypeEnum.ARTBOARD,
		sourceEntityId: artboard.id,
		targetEntityId: artboardVersion.id,
	})
}

const cloneArtboardLayersToVersion = async ({
	artboard,
	artboardVersion,
}: {
	artboard: IArtboardWithDesignsAndLayers
	artboardVersion: IArtboardVersion
}) => {
	return await artboardVersionCloneLayersService({
		userId: artboard.ownerId,
		sourceEntityType: LayerCloneSourceTypeEnum.ARTBOARD,
		sourceEntityId: artboard.id,
		targetEntityId: artboardVersion.id,
	})
}

await createArtboardVersionsBranches()