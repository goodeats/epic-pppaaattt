import {
	type IDesignSubmission,
	type IDesignParsed,
	type DesignTypeEnum,
} from '../definitions'

export interface IDesignPalette extends IDesignParsed {
	type: typeof DesignTypeEnum.PALETTE
	attributes: IDesignAttributesPalette
}

// when adding attributes to an design type,
// make sure it starts as optional or is set to a default value
// for when parsing the design from the deserializer
export interface IDesignAttributesPalette {
	value: string
}

export interface IDesignPaletteSubmission
	extends IDesignSubmission,
		IDesignAttributesPalette {}
