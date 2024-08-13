import { type IClonedResponse } from '#app/definitions/intent-action-args'
import { type IDesignAttributes } from './definitions'

export interface IDesignCloneData {
	visible?: boolean
	selected?: boolean
	attributes?: IDesignAttributes
}

export interface IDesignsClonedResponse extends IClonedResponse {}
