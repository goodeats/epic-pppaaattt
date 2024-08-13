import { type Design } from '@prisma/client'
import { type DateOrString } from '#app/definitions/prisma-helper'
import {
	type IArtworkVersion,
	type IArtworkVersionWithChildren,
} from '../artwork-version/definitions'
import { type IFill } from '../design-type/fill/fill.server'
import { type ILayout } from '../design-type/layout/layout.server'
import { type ILine } from '../design-type/line/line.server'
import { type IPalette } from '../design-type/palette/palette.server'
import { type IRotate } from '../design-type/rotate/rotate.server'
import { type ISize } from '../design-type/size/size.server'
import { type IStroke } from '../design-type/stroke/stroke.server'
import { type ITemplate } from '../design-type/template/template.server'
import { type ILayerWithChildren } from '../layer/definitions'
import { type IUser } from '../user/user.server'
import {
	type IDesignAttributesFill,
	type IDesignFill,
} from './fill/definitions'
import {
	type IDesignLayout,
	type IDesignAttributesLayout,
} from './layout/layout.server'
import {
	type IDesignAttributesLine,
	type IDesignLine,
} from './line/line.server'
import {
	type IDesignAttributesPalette,
	type IDesignPalette,
} from './palette/palette.server'
import {
	type IDesignAttributesRotate,
	type IDesignRotate,
} from './rotate/rotate.server'
import {
	type IDesignAttributesSize,
	type IDesignSize,
} from './size/size.server'
import {
	type IDesignStroke,
	type IDesignAttributesStroke,
} from './stroke/stroke.server'
import {
	type IDesignAttributesTemplate,
	type IDesignTemplate,
} from './template/template.server'
import { ObjectValues } from '#app/utils/typescript-helpers'

// Omitting 'createdAt' and 'updatedAt' from the Design interface
// prisma query returns a string for these fields
// omit type string to ensure type safety with designTypeEnum
// omit attributes string so that extended design types can insert their own attributes
type BaseDesign = Omit<
	Design,
	'type' | 'attributes' | 'createdAt' | 'updatedAt'
>

export interface IDesign extends BaseDesign {
	type: string
	attributes: string
	createdAt: DateOrString
	// updatedAt: DateOrString
}

// when adding attributes to a design type,
// make sure it starts as optional or is set to a default value
// for when parsing the design from the deserializer
export type IDesignAttributes =
	| IDesignAttributesFill
	| IDesignAttributesLayout
	| IDesignAttributesLine
	| IDesignAttributesPalette
	| IDesignAttributesRotate
	| IDesignAttributesSize
	| IDesignAttributesStroke
	| IDesignAttributesTemplate

export interface IDesignParsed extends BaseDesign {
	type: designTypeEnum
	attributes: IDesignAttributes
	createdAt: DateOrString
	// updatedAt: DateOrString
}

export type IDesignToGroup = IDesign | IDesignParsed

export const DesignTypeEnum = {
	PALETTE: 'palette',
	SIZE: 'size',
	FILL: 'fill',
	STROKE: 'stroke',
	LINE: 'line',
	ROTATE: 'rotate',
	LAYOUT: 'layout',
	TEMPLATE: 'template',
	// add more design types here
} as const
export type designTypeEnum = ObjectValues<typeof DesignTypeEnum>
export const designTypes = Object.values(DesignTypeEnum)

export type IDesignType =
	| IDesignFill
	| IDesignLayout
	| IDesignLine
	| IDesignPalette
	| IDesignRotate
	| IDesignSize
	| IDesignStroke
	| IDesignTemplate

export type IDesignByType = {
	designFills: IDesignFill[]
	designLayouts: IDesignLayout[]
	designLines: IDesignLine[]
	designPalettes: IDesignPalette[]
	designRotates: IDesignRotate[]
	designSizes: IDesignSize[]
	designStrokes: IDesignStroke[]
	designTemplates: IDesignTemplate[]
}

export interface IDesignsByTypeWithType {
	type: designTypeEnum
	designs: IDesignType[]
}

export type IDesignParent = IArtworkVersionWithChildren | ILayerWithChildren

export interface IDesignData {
	visible: boolean
	selected: boolean
}

export interface IDesignSubmission extends IDesignData {
	userId: IUser['id']
}

export interface IDesignTypeSelected {
	palette: IDesignPalette | null | undefined
	size: IDesignSize | null | undefined
	fill: IDesignFill | null | undefined
	stroke: IDesignStroke | null | undefined
	line: IDesignLine | null | undefined
	rotate: IDesignRotate | null | undefined
	layout: IDesignLayout | null | undefined
	template: IDesignTemplate | null | undefined
}

export interface IDesignTypeSelectedFiltered {
	palette?: IDesignPalette
	size?: IDesignSize
	fill?: IDesignFill
	stroke?: IDesignStroke
	line?: IDesignLine
	rotate?: IDesignRotate
	layout?: IDesignLayout
	template?: IDesignTemplate
}

export type IDesignIdOrNull = IDesign['id'] | null | undefined

export type IDesignEntityId =
	| IDesign['id']
	| IArtworkVersion['id']
	| IArtworkVersionWithChildren['id']
export type IDesignEntityIdOrNull = IDesignEntityId | null | undefined

export interface IDesignWithType {
	id: string
	type: string
	visible: boolean
	selected: boolean
	createdAt: Date | string
	nextId: string | null
	prevId: string | null
	ownerId: string
	artworkVersionId: string | null
	layerId: string | null
	palette: IPalette | null
	size: ISize | null
	fill: IFill | null
	stroke: IStroke | null
	line: ILine | null
	rotate: IRotate | null
	layout: ILayout | null
	template: ITemplate | null
}

export interface IDesignsByType {
	designPalettes: IDesignWithPalette[]
	designSizes: IDesignWithSize[]
	designFills: IDesignWithFill[]
	designStrokes: IDesignWithStroke[]
	designLines: IDesignWithLine[]
	designRotates: IDesignWithRotate[]
	designLayouts: IDesignWithLayout[]
	designTemplates: IDesignWithTemplate[]
}

export interface IDesignWithPalette extends IDesignWithType {
	palette: IPalette
}

export interface IDesignWithSize extends IDesignWithType {
	size: ISize
}

export interface IDesignWithFill extends IDesignWithType {
	fill: IFill
}

export interface IDesignWithStroke extends IDesignWithType {
	stroke: IStroke
}

export interface IDesignWithLine extends IDesignWithType {
	line: ILine
}

export interface IDesignWithRotate extends IDesignWithType {
	rotate: IRotate
}

export interface IDesignWithLayout extends IDesignWithType {
	layout: ILayout
}

export interface IDesignWithTemplate extends IDesignWithType {
	template: ITemplate
}
