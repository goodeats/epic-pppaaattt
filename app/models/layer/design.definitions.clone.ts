import { IDesignParsed } from '../design/definitions'
import { IUser } from '../user/user.server'
import { ILayer } from './definitions'

export interface ILayerDesignCloneSubmission {
	userId: IUser['id']
	layerId: ILayer['id']
	designs: IDesignParsed[]
}
