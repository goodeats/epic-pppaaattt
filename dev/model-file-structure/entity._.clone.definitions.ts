import { type IClonedResponse } from '#app/definitions/intent-action-args.js'
import { type IExampleEntity } from './entity._._definitions'

export interface IExampleEntityCloneData {
	id: IExampleEntity['id']
	name: string
	description: string | null
}

export interface IExampleEntitiesClonedResponse extends IClonedResponse {}
