import { type ICreatedResponse } from '#app/definitions/intent-action-args'
import { type IArtworkVersionDesignCreateData } from '../artwork-version/design/definitions.create'
import { type IFillCreateOverrides } from '../design-type/fill/fill.create.server'
import { type ILayoutCreateOverrides } from '../design-type/layout/layout.create.server'
import { type ILineCreateOverrides } from '../design-type/line/line.create.server'
import { type IPaletteCreateOverrides } from '../design-type/palette/palette.create.server'
import { type IRotateCreateOverrides } from '../design-type/rotate/rotate.create.server'
import { type ISizeCreateOverrides } from '../design-type/size/size.create.server'
import { type IStrokeCreateOverrides } from '../design-type/stroke/stroke.create.server'
import { type ITemplateCreateOverrides } from '../design-type/template/template.create.server'
import { type ILayerDesignCreateData } from '../layer/design.definitions.create'
import { type IUser } from '../user/user.server'
import {
	type IDesign,
	type IDesignAttributes,
	type IDesignData,
	type designTypeEnum,
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
