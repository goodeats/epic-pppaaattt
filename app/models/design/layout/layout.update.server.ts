import { type IDesign } from '../definitions'
import { type IDesignUpdateData } from '../definitions.update'
import {
	type IDesignLayoutSubmission,
	type IDesignAttributesLayout,
	type IDesignLayout,
} from './layout.server'

export interface IDesignLayoutUpdatedResponse {
	success: boolean
	message?: string
	updatedDesignLayout?: IDesign
}

export interface IDesignLayoutUpdateSubmission extends IDesignLayoutSubmission {
	id: IDesignLayout['id']
}

export interface IDesignLayoutUpdateData extends IDesignUpdateData {
	attributes: IDesignAttributesLayout
}
