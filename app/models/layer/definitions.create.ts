import { type ICreatedResponse } from '#app/definitions/intent-action-args'
import { type IArtworkVersionLayerCreateData } from '../artwork-version/layer/definitions.create'
import { type IUser } from '../user/user.server'
import { type ILayer, type ILayerData } from './definitions'

export interface ILayerNewData {}

export interface ILayerCreateData extends ILayerData {
	ownerId: IUser['id']
}

export type ILayerParentCreateData = IArtworkVersionLayerCreateData

export interface ILayerCreatedResponse extends ICreatedResponse {
	createdLayer?: ILayer
}
