import { IUpdatedResponse } from '#app/definitions/intent-action-args'
import { IUser } from '../user/user.server'
import { ILayer, ILayerData } from './definitions'

export interface ILayerUpdateSubmission {
	userId: IUser['id']
	id: ILayer['id']
}

export interface ILayerUpdateFieldData {
	id: ILayer['id']
}

export interface ILayerUpdateOrderData {
	direction: 'up' | 'down'
}

export interface ILayerUpdateData extends ILayerData {}

export interface ILayerUpdateParams {
	id: ILayer['id']
	ownerId: IUser['id']
}

export interface ILayerUpdatedResponse extends IUpdatedResponse {
	updatedLayer?: ILayer
}
