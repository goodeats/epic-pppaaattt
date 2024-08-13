import { type Artwork } from '@prisma/client'
import { type DateOrString } from '#app/definitions/prisma-helper'
import { type IAssetParsed } from '../asset/asset.server'
import { type IProjectWithArtworks } from '../project/project.server'
import { IArtworkBranchWithVersions } from '../artwork-branch/_._definitions'

// Omitting 'createdAt' and 'updatedAt' from the Artwork interface
// prisma query returns a string for these fields
type BaseArtwork = Omit<Artwork, 'createdAt' | 'updatedAt'>

export interface IArtwork extends BaseArtwork {
	createdAt: DateOrString
	updatedAt: DateOrString
}
export interface IArtworkWithProject extends IArtwork {
	project: IProjectWithArtworks
}

export interface IArtworkWithBranchesAndVersions extends IArtwork {
	branches: IArtworkBranchWithVersions[]
}

export interface IArtworkWithAssets extends IArtwork {
	assets: IAssetParsed[]
}

export interface IArtworkParentData {
	artworkId: IArtwork['id']
}
