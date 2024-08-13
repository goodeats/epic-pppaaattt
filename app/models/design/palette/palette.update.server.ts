import { type IDesign } from '../definitions'
import { IDesignUpdateData } from '../definitions.update'
import {
	type IDesignPaletteSubmission,
	type IDesignAttributesPalette,
	type IDesignPalette,
} from './palette.server'

export interface IDesignPaletteUpdatedResponse {
	success: boolean
	message?: string
	updatedDesignPalette?: IDesign
}

export interface IDesignPaletteUpdateSubmission
	extends IDesignPaletteSubmission {
	id: IDesignPalette['id']
}

export interface IDesignPaletteUpdateData extends IDesignUpdateData {
	attributes: IDesignAttributesPalette
}
