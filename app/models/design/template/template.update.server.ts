import { type IDesign } from '../definitions'
import { type IDesignUpdateData } from '../definitions.update'
import {
	type IDesignTemplateSubmission,
	type IDesignAttributesTemplate,
	type IDesignTemplate,
} from './template.server'

export interface IDesignTemplateUpdatedResponse {
	success: boolean
	message?: string
	updatedDesignTemplate?: IDesign
}

export interface IDesignTemplateUpdateSubmission
	extends IDesignTemplateSubmission {
	id: IDesignTemplate['id']
}

export interface IDesignTemplateUpdateData extends IDesignUpdateData {
	attributes: IDesignAttributesTemplate
}
