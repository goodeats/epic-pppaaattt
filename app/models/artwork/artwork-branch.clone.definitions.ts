import { type IArtworkBranchSubmission } from '../artwork-branch/_._definitions'
import { type IArtworkBranchCloneData } from '../artwork-branch/_.clone.definitions'
import { type IArtworkVersion } from '../artwork-version/definitions'
import { type IArtworkParentData } from './_._definiitions'

export interface IArtworkArtworkBranchCloneData
	extends IArtworkBranchCloneData,
		IArtworkParentData {}

export interface IArtworkArtworkBranchCloneSubmission
	extends IArtworkArtworkBranchCloneData,
		IArtworkBranchSubmission {
	name: string
	description: string
	versionId: IArtworkVersion['id']
}
