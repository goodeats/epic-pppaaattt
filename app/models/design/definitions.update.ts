import { IUpdatedResponse } from '#app/definitions/intent-action-args'
import { IUser } from '../user/user.server'
import {
	IDesign,
	IDesignAttributes,
	IDesignData,
	designTypeEnum,
} from './definitions'

export interface IDesignUpdateSubmission {
	userId: IUser['id']
	id: IDesign['id']
}

export interface IDesignUpdateFieldData {
	id: IDesign['id']
}

export interface IDesignUpdateData extends IDesignData {
	attributes: IDesignAttributes
}

export interface IDesignUpdateParams {
	id: IDesign['id']
	ownerId: IUser['id']
}

export interface IDesignUpdateAttributesParams extends IDesignUpdateParams {
	type: designTypeEnum
	attributes: IDesignAttributes
}

export interface IDesignUpdatedResponse extends IUpdatedResponse {
	updatedDesign?: IDesign
}
