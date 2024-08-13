import { IArtworkVersionCloneData } from '../artwork-version/_.clone.definitions'
import { IArtworkVersionSubmission } from '../artwork-version/definitions'
import { IArtworkBranchParentData } from './_._definitions'

export interface IArtworkBranchArtworkVersionCloneData
	extends IArtworkVersionCloneData,
		IArtworkBranchParentData {}

export interface IArtworkBranchArtworkVersionCloneSubmission
	extends IArtworkBranchArtworkVersionCloneData,
		IArtworkVersionSubmission {
	description: string
}
