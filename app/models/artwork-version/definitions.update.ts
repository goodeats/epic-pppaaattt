import { IUpdatedResponse } from '#app/definitions/intent-action-args'
import { IUser } from '../user/user.server'
import { IArtworkVersion, IArtworkVersionData } from './definitions'

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
