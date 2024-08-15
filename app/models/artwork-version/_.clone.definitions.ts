import { type IClonedResponse } from '#app/definitions/intent-action-args.js'
import { type IArtworkVersion } from './definitions'

export interface IArtworkVersionCloneData {
	id: IArtworkVersion['id']
	description: string
}

export interface IArtworkVersionsClonedResponse extends IClonedResponse {}
