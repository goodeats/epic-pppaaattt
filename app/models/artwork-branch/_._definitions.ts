import { type ArtworkBranch } from '@prisma/client'
import { type DateOrString } from '#app/definitions/prisma-helper'
import { type ISubmission } from '#app/definitions/submission.js'
import { type IArtworkVersion } from '../artwork-version/definitions'

// Omitting 'createdAt' and 'updatedAt' from the ArtworkBranch interface
// prisma query returns a string for these fields
type BaseArtworkBranch = Omit<ArtworkBranch, 'createdAt' | 'updatedAt'>

export interface IArtworkBranch extends BaseArtworkBranch {
	createdAt: DateOrString
	updatedAt: DateOrString
}

export interface IArtworkBranchWithVersions extends IArtworkBranch {
	versions: IArtworkVersion[]
}

export interface IArtworkBranchData {
	name: string
	slug: string
	description?: string | null // optional nullable string
}

export interface IArtworkBranchSubmission
	extends IArtworkBranchData,
		ISubmission {}

export interface IArtworkBranchParentData {
	branchId: IArtworkBranch['id']
}
