import { type ICreatedResponse } from '#app/definitions/intent-action-args'
import { type IUser } from '#app/models/user/user.server.js'
import { type IArtworkArtworkBranchCreateData } from '../artwork/artwork-branch.create.definitions'
import { type IArtworkBranch, type IArtworkBranchData } from './_._definitions'

export interface IArtworkBranchNewData {
	// Any specific fields for new ArtworkBranch, if any
}

export interface IArtworkBranchCreateData extends IArtworkBranchData {
	ownerId: IUser['id']
	parentId: IArtworkBranch['id']
	description: string
}

export type IArtworkBranchParentCreateData = IArtworkArtworkBranchCreateData
// Add more parent models here if needed

export interface IArtworkBranchCreatedResponse extends ICreatedResponse {
	createdArtworkBranch?: IArtworkBranch
}
