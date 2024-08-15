import { type ArtworkVersion } from '@prisma/client'
import { type IArtworkVersionGenerator } from '#app/definitions/artwork-generator'
import { type DateOrString } from '#app/definitions/prisma-helper'
import { type ISubmission } from '#app/definitions/submission.js'
import { type IArtworkBranch } from '../artwork-branch/_._definitions'
import { type IAssetParsed } from '../asset/asset.server'
import { type IDesignParsed } from '../design/definitions'
import { type ILayerWithChildren } from '../layer/definitions'

// Omitting 'createdAt' and 'updatedAt' from the ArtworkVersion interface
// prisma query returns a string for these fields
type BaseArtworkVersion = Omit<
	ArtworkVersion,
	'createdAt' | 'updatedAt' | 'publishedAt'
>

export interface IArtworkVersion extends BaseArtworkVersion {
	createdAt: DateOrString
	updatedAt: DateOrString
	publishedAt: DateOrString | null
}

export interface IArtworkVersionWithChildren extends IArtworkVersion {
	designs: IDesignParsed[]
	layers: ILayerWithChildren[]
	assets: IAssetParsed[]
	branch?: IArtworkBranch
}

// created this for profile artwork view to review starred versions
// now wanting to display canvas from dialog
// canvas requires designs and layers to compute
// temp fix is to include branch for its name in table display
export interface IArtworkVersionWithBranch extends IArtworkVersion {
	branch: IArtworkBranch
}

export interface IArtworkVersionWithGenerator
	extends IArtworkVersionWithChildren {
	generator: IArtworkVersionGenerator
}

export interface IArtworkVersionData {
	name: string
	slug?: string
	description?: string
	width?: number
	height?: number
	background?: string
	watermark?: boolean
	watermarkColor?: string
}

export interface IArtworkVersionSubmission
	extends IArtworkVersionData,
		ISubmission {}

export interface IArtworkVersionParentData {
	artworkVersionId: IArtworkVersion['id']
}
