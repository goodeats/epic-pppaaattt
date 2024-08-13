import { type IUpdatedResponse } from '#app/definitions/intent-action-args'
import { type IUser } from '../user/user.server'
import { type ILayer, type ILayerData } from './definitions'

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
