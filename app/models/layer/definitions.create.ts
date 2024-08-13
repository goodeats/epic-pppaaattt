import { ICreatedResponse } from '#app/definitions/intent-action-args'
import { IArtworkVersionLayerCreateData } from '../artwork-version/layer/definitions.create'
import { IUser } from '../user/user.server'
import { ILayer, ILayerData } from './definitions'

export interface ILayerNewData {}

export interface ILayerCreateData extends ILayerData {
	ownerId: IUser['id']
}

export type ILayerParentCreateData = IArtworkVersionLayerCreateData

export interface ILayerCreatedResponse extends ICreatedResponse {
	createdLayer?: ILayer
}
