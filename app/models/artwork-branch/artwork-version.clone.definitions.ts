import { type IArtworkVersionCloneData } from '../artwork-version/_.clone.definitions'
import { type IArtworkVersionSubmission } from '../artwork-version/definitions'
import { type IArtworkBranchParentData } from './_._definitions'

export interface IArtworkBranchArtworkVersionCloneData
	extends IArtworkVersionCloneData,
		IArtworkBranchParentData {}

export interface IArtworkBranchArtworkVersionCloneSubmission
	extends IArtworkBranchArtworkVersionCloneData,
		IArtworkVersionSubmission {
	description: string
}
