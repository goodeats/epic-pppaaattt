import { type IDesignParsed } from '../design/definitions'
import { type IUser } from '../user/user.server'
import { type ILayer } from './definitions'

export interface ILayerDesignCloneSubmission {
	userId: IUser['id']
	layerId: ILayer['id']
	designs: IDesignParsed[]
}
