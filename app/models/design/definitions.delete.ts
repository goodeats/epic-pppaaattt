import { type IDeletedResponse } from '#app/definitions/intent-action-args'
import { type IUser } from '../user/user.server'
import { type IDesign } from './definitions'

export interface IDesignDeleteData {
	id: IDesign['id']
}

export interface IDesignDeleteParams {
	id: IDesign['id']
	ownerId: IUser['id']
}

export interface IDesignDeletedResponse extends IDeletedResponse {}
