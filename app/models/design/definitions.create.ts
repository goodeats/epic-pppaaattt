import { ICreatedResponse } from '#app/definitions/intent-action-args'
import { IArtworkVersionDesignCreateData } from '../artwork-version/design/definitions.create'
import { IFillCreateOverrides } from '../design-type/fill/fill.create.server'
import { ILayoutCreateOverrides } from '../design-type/layout/layout.create.server'
import { ILineCreateOverrides } from '../design-type/line/line.create.server'
import { IPaletteCreateOverrides } from '../design-type/palette/palette.create.server'
import { IRotateCreateOverrides } from '../design-type/rotate/rotate.create.server'
import { ISizeCreateOverrides } from '../design-type/size/size.create.server'
import { IStrokeCreateOverrides } from '../design-type/stroke/stroke.create.server'
import { ITemplateCreateOverrides } from '../design-type/template/template.create.server'
import { ILayerDesignCreateData } from '../layer/design.definitions.create'
import { IUser } from '../user/user.server'
import {
	IDesign,
	IDesignAttributes,
	IDesignData,
	designTypeEnum,
} from './definitions'

export interface IDesignNewData {
	type: designTypeEnum
}

export interface IDesignCreateData extends IDesignData {
	ownerId: IUser['id']
	type: designTypeEnum
	attributes: IDesignAttributes
}

export type IDesignParentCreateData =
	| IArtworkVersionDesignCreateData
	| ILayerDesignCreateData

export interface IDesignCreatedResponse extends ICreatedResponse {
	createdDesign?: IDesign
}

export interface IDesignCreateOverrides {
	visible?: boolean
	selected?: boolean
}

export type IDesignTypeCreateOverrides =
	| IPaletteCreateOverrides
	| ISizeCreateOverrides
	| IFillCreateOverrides
	| IStrokeCreateOverrides
	| ILineCreateOverrides
	| IRotateCreateOverrides
	| ILayoutCreateOverrides
	| ITemplateCreateOverrides
