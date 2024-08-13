import { type IUpdatedResponse } from '#app/definitions/intent-action-args'
import { type IUser } from '../user/user.server'
import { type IArtworkVersion, type IArtworkVersionData } from './definitions'

export interface IArtworkVersionUpdateSubmission {
	userId: IUser['id']
	id: IArtworkVersion['id']
}

export interface IArtworkVersionUpdateFieldData {
	id: IArtworkVersion['id']
}

export interface IArtworkVersionUpdateData extends IArtworkVersionData {}

export interface IArtworkVersionUpdateParams {
	id: IArtworkVersion['id']
	ownerId: IUser['id']
}

export interface IArtworkVersionUpdatedResponse extends IUpdatedResponse {
	updatedArtworkVersion?: IArtworkVersion
}
