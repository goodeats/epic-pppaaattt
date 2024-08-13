import { ZodError } from 'zod'
import {
	initializeEnumItemsMap,
	safelyAssignValue,
} from '#app/utils/typescript-helpers'
import {
	type IDesignByType,
	type IDesign,
	type IDesignParsed,
	type IDesignsByTypeWithType,
	type IDesignTypeSelected,
	type IDesignTypeSelectedFiltered,
	type IDesignAttributes,
	designTypeEnum,
	DesignTypeEnum,
	IDesignToGroup,
	IDesignType,
} from './definitions'
import {
	type IDesignAttributesFill,
	type IDesignFill,
} from './fill/definitions'
import { DesignAttributesFillDefaultSchema } from './fill/schema'
import {
	parseDesignFillAttributes,
	stringifyDesignFillAttributes,
} from './fill/utils'
import {
	type IDesignAttributesLayout,
	type IDesignLayout,
} from './layout/layout.server'
import {
	parseDesignLayoutAttributes,
	stringifyDesignLayoutAttributes,
} from './layout/utils'
import {
	type IDesignAttributesLine,
	type IDesignLine,
} from './line/line.server'
import {
	parseDesignLineAttributes,
	stringifyDesignLineAttributes,
} from './line/utils'
import {
	type IDesignAttributesPalette,
	type IDesignPalette,
} from './palette/palette.server'
import {
	parseDesignPaletteAttributes,
	stringifyDesignPaletteAttributes,
} from './palette/utils'
import {
	type IDesignAttributesRotate,
	type IDesignRotate,
} from './rotate/rotate.server'
import {
	parseDesignRotateAttributes,
	stringifyDesignRotateAttributes,
} from './rotate/utils'
import {
	type IDesignAttributesSize,
	type IDesignSize,
} from './size/size.server'
import {
	parseDesignSizeAttributes,
	stringifyDesignSizeAttributes,
} from './size/utils'
import {
	type IDesignAttributesStroke,
	type IDesignStroke,
} from './stroke/stroke.server'
import {
	parseDesignStrokeAttributes,
	stringifyDesignStrokeAttributes,
} from './stroke/utils'
import {
	type IDesignAttributesTemplate,
	type IDesignTemplate,
} from './template/template.server'
import {
	parseDesignTemplateAttributes,
	stringifyDesignTemplateAttributes,
} from './template/utils'
import { orderLinkedItems } from '../__shared/linked-list.utils'

export const deserializeDesigns = ({
	designs,
}: {
	designs: IDesign[]
}): IDesignParsed[] => {
	return designs.map(design => deserializeDesign({ design }))
}

export const deserializeDesign = ({
	design,
}: {
	design: IDesign
}): IDesignParsed => {
	const type = design.type as designTypeEnum
	const { attributes } = design

	const validatedDesignAttributes = validateDesignAttributes({
		type,
		attributes,
	})

	return {
		...design,
		type,
		attributes: validatedDesignAttributes,
	}
}

export const validateDesignAttributes = ({
	type,
	attributes,
}: {
	type: designTypeEnum
	attributes: IDesign['attributes']
}) => {
	try {
		switch (type) {
			case DesignTypeEnum.FILL:
				return parseDesignFillAttributes(attributes)
			case DesignTypeEnum.LAYOUT:
				return parseDesignLayoutAttributes(attributes)
			case DesignTypeEnum.LINE:
				return parseDesignLineAttributes(attributes)
			case DesignTypeEnum.PALETTE:
				return parseDesignPaletteAttributes(attributes)
			case DesignTypeEnum.ROTATE:
				return parseDesignRotateAttributes(attributes)
			case DesignTypeEnum.SIZE:
				return parseDesignSizeAttributes(attributes)
			case DesignTypeEnum.STROKE:
				return parseDesignStrokeAttributes(attributes)
			case DesignTypeEnum.TEMPLATE:
				return parseDesignTemplateAttributes(attributes)
			default:
				throw new Error(`Unsupported design type: ${type}`)
		}
	} catch (error: any) {
		if (error instanceof ZodError) {
			throw new Error(
				`Validation failed for design type ${type}: ${error.errors.map(e => e.message).join(', ')}`,
			)
		} else {
			throw new Error(
				`Unexpected error during validation for design type ${type}: ${error.message}`,
			)
		}
	}
}

export const serializeDesigns = ({
	designs,
}: {
	designs: IDesignParsed[]
}): IDesign[] => {
	return designs.map(design => serializeDesign({ design }))
}

export const serializeDesign = ({
	design,
}: {
	design: IDesignParsed
}): IDesign => {
	const type = design.type as designTypeEnum
	const { attributes } = design

	const stringifiedDesignAttributes = stringifyDesignAttributes({
		type,
		attributes,
	})

	return {
		...design,
		type,
		attributes: stringifiedDesignAttributes,
	}
}

export const stringifyDesignAttributes = ({
	type,
	attributes,
}: {
	type: designTypeEnum
	attributes: IDesignAttributes
}) => {
	try {
		switch (type) {
			case DesignTypeEnum.FILL:
				return stringifyDesignFillAttributes(
					attributes as IDesignAttributesFill,
				)
			case DesignTypeEnum.LAYOUT:
				return stringifyDesignLayoutAttributes(
					attributes as IDesignAttributesLayout,
				)
			case DesignTypeEnum.LINE:
				return stringifyDesignLineAttributes(
					attributes as IDesignAttributesLine,
				)
			case DesignTypeEnum.PALETTE:
				return stringifyDesignPaletteAttributes(
					attributes as IDesignAttributesPalette,
				)
			case DesignTypeEnum.ROTATE:
				return stringifyDesignRotateAttributes(
					attributes as IDesignAttributesRotate,
				)
			case DesignTypeEnum.SIZE:
				return stringifyDesignSizeAttributes(
					attributes as IDesignAttributesSize,
				)
			case DesignTypeEnum.STROKE:
				return stringifyDesignStrokeAttributes(
					attributes as IDesignAttributesStroke,
				)
			case DesignTypeEnum.TEMPLATE:
				return stringifyDesignTemplateAttributes(
					attributes as IDesignAttributesTemplate,
				)
			default:
				throw new Error(`Unsupported design type: ${type}`)
		}
	} catch (error: any) {
		if (error instanceof ZodError) {
			throw new Error(
				`Validation failed for design type ${type}: ${error.errors.map(e => e.message).join(', ')}`,
			)
		} else {
			throw new Error(
				`Unexpected error during validation for design type ${type}: ${error.message}`,
			)
		}
	}
}

export const filterDesignsVisible = ({
	designs,
}: {
	designs: IDesignToGroup[]
}): IDesignToGroup[] => {
	return designs.filter(design => design.visible)
}

export const filterDesignType = ({
	designs,
	type,
}: {
	designs: IDesignToGroup[]
	type: designTypeEnum
}): IDesignToGroup[] => {
	return designs.filter(design => design.type === type)
}

export const groupDesignsByType = ({
	designs,
}: {
	designs: IDesignToGroup[]
}): IDesignByType => {
	const designFills = orderLinkedItems<IDesignToGroup>(
		filterDesignType({
			designs,
			type: DesignTypeEnum.FILL,
		}),
	) as IDesignFill[]
	const designLayouts = orderLinkedItems<IDesignToGroup>(
		filterDesignType({
			designs,
			type: DesignTypeEnum.LAYOUT,
		}),
	) as IDesignLayout[]
	const designLines = orderLinkedItems<IDesignToGroup>(
		filterDesignType({
			designs,
			type: DesignTypeEnum.LINE,
		}),
	) as IDesignLine[]
	const designPalettes = orderLinkedItems<IDesignToGroup>(
		filterDesignType({
			designs,
			type: DesignTypeEnum.PALETTE,
		}),
	) as IDesignPalette[]
	const designRotates = orderLinkedItems<IDesignToGroup>(
		filterDesignType({
			designs,
			type: DesignTypeEnum.ROTATE,
		}),
	) as IDesignRotate[]
	const designSizes = orderLinkedItems<IDesignToGroup>(
		filterDesignType({
			designs,
			type: DesignTypeEnum.SIZE,
		}),
	) as IDesignSize[]
	const designStrokes = orderLinkedItems<IDesignToGroup>(
		filterDesignType({
			designs,
			type: DesignTypeEnum.STROKE,
		}),
	) as IDesignStroke[]
	const designTemplates = orderLinkedItems<IDesignToGroup>(
		filterDesignType({
			designs,
			type: DesignTypeEnum.TEMPLATE,
		}),
	) as IDesignTemplate[]

	return {
		designFills,
		designLayouts,
		designLines,
		designPalettes,
		designRotates,
		designSizes,
		designStrokes,
		designTemplates,
	}
}

export const groupDesignTypes = ({
	designs,
}: {
	designs: IDesignToGroup[]
}): IDesignType[][] => {
	const groupedDesignsByType = groupDesignsByType({ designs })
	return [
		groupedDesignsByType.designFills,
		groupedDesignsByType.designLayouts,
		groupedDesignsByType.designLines,
		groupedDesignsByType.designPalettes,
		groupedDesignsByType.designRotates,
		groupedDesignsByType.designSizes,
		groupedDesignsByType.designStrokes,
		groupedDesignsByType.designTemplates,
	]
}

export const designsByTypeToPanelArray = ({
	designs,
}: {
	designs: IDesignByType
}): IDesignsByTypeWithType[] => {
	const {
		designFills,
		designLayouts,
		designLines,
		designPalettes,
		designRotates,
		designSizes,
		designStrokes,
		designTemplates,
	} = designs

	return [
		{
			type: DesignTypeEnum.FILL,
			designs: designFills,
		},
		{
			type: DesignTypeEnum.LAYOUT,
			designs: designLayouts,
		},
		{
			type: DesignTypeEnum.LINE,
			designs: designLines,
		},
		{
			type: DesignTypeEnum.PALETTE,
			designs: designPalettes,
		},
		{
			type: DesignTypeEnum.ROTATE,
			designs: designRotates,
		},
		{
			type: DesignTypeEnum.SIZE,
			designs: designSizes,
		},
		{
			type: DesignTypeEnum.STROKE,
			designs: designStrokes,
		},
		{
			type: DesignTypeEnum.TEMPLATE,
			designs: designTemplates,
		},
	]
}

// used from artwork create service
// get all selected designs by type for artwork and each layer
// then separate them by type here
export const findFirstDesignsByTypeInArray = ({
	designs,
}: {
	designs: IDesignParsed[]
}): IDesignTypeSelected => {
	const fill =
		(filterDesignType({
			designs,
			type: DesignTypeEnum.FILL,
		})[0] as IDesignFill) || null
	const layout =
		(filterDesignType({
			designs,
			type: DesignTypeEnum.LAYOUT,
		})[0] as IDesignLayout) || null
	const line =
		(filterDesignType({
			designs,
			type: DesignTypeEnum.LINE,
		})[0] as IDesignLine) || null
	const palette =
		(filterDesignType({
			designs,
			type: DesignTypeEnum.PALETTE,
		})[0] as IDesignPalette) || null
	const rotate =
		(filterDesignType({
			designs,
			type: DesignTypeEnum.ROTATE,
		})[0] as IDesignRotate) || null
	const size =
		(filterDesignType({
			designs,
			type: DesignTypeEnum.SIZE,
		})[0] as IDesignSize) || null
	const stroke =
		(filterDesignType({
			designs,
			type: DesignTypeEnum.STROKE,
		})[0] as IDesignStroke) || null
	const template =
		(filterDesignType({
			designs,
			type: DesignTypeEnum.TEMPLATE,
		})[0] as IDesignTemplate) || null

	return {
		fill,
		layout,
		line,
		palette,
		rotate,
		size,
		stroke,
		template,
	}
}

// used from artwork generator create service
// layer generators will have artwork generator designs as default
// so only return the selected designs for layer to merge and override
export const filterSelectedDesignTypes = ({
	selectedDesignTypes,
}: {
	selectedDesignTypes: IDesignTypeSelected
}): IDesignTypeSelectedFiltered => {
	const filteredSelectedDesigns: Partial<IDesignTypeSelectedFiltered> = {}

	const designTypes = Object.keys(
		selectedDesignTypes,
	) as (keyof IDesignTypeSelected)[]

	for (const designType of designTypes) {
		const designValue = selectedDesignTypes[designType]

		if (designValue === null) continue

		safelyAssignValue(filteredSelectedDesigns, designType, designValue)
	}

	return filteredSelectedDesigns as IDesignTypeSelectedFiltered
}

// used from artwork generator create service
// verify artwork has all design types
// or canvas shouldn't be displayed
export const verifySelectedDesignTypesAllPresent = ({
	selectedDesignTypes,
}: {
	selectedDesignTypes: IDesignTypeSelected
}): {
	success: boolean
	message: string
} => {
	// set the design types to array from keys
	const designTypes = Object.keys(
		selectedDesignTypes,
	) as (keyof IDesignTypeSelected)[]

	// iterate through each design type
	for (const designType of designTypes) {
		// if the design type is not present
		if (!selectedDesignTypes[designType]) {
			// return an error message
			// with the design type in the message
			// indicating that the design type is missing
			return {
				success: false,
				message: `Please make a ${designType} design available for the artwork.`,
			}
		}
	}

	// if all design types are present
	return { success: true, message: 'All selected designs are present' }
}

export const findDesignAttributesDefaultSchemaByType = ({
	type,
}: {
	type: designTypeEnum
}) => {
	switch (type) {
		case DesignTypeEnum.FILL:
			return DesignAttributesFillDefaultSchema
		case DesignTypeEnum.LAYOUT:
		case DesignTypeEnum.LINE:
		case DesignTypeEnum.PALETTE:
		case DesignTypeEnum.ROTATE:
		case DesignTypeEnum.SIZE:
		case DesignTypeEnum.STROKE:
		case DesignTypeEnum.TEMPLATE:
		default:
			throw new Error(`Unsupported design type: ${type}`)
	}
}
