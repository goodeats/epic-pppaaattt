import { type ICreatedResponse } from '#app/definitions/intent-action-args'
import { type IArtworkBranchArtworkVersionCreateData } from '../artwork-branch/artwork-version.create.definitions'
import { type IUser } from '../user/user.server'
import { type IArtworkVersion, type IArtworkVersionData } from './definitions'

export interface IArtworkVersionNewData {}

export interface IArtworkVersionCreateData extends IArtworkVersionData {
	ownerId: IUser['id']
}

export type IArtworkVersionParentCreateData =
	IArtworkBranchArtworkVersionCreateData

export interface IArtworkVersionCreatedResponse extends ICreatedResponse {
	createdArtworkVersion?: IArtworkVersion
}
