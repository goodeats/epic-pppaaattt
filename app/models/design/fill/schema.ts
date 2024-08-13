import { type ZodType, z } from 'zod'
import { DesignTypeEnum } from '#app/models/design/definitions'
import { HexcodeSchema } from '#app/schema/colors'
import { type ObjectValues } from '#app/utils/typescript-helpers'
import { DesignDataSchema } from '../schema'
import {
	type IDesignFillStyle,
	type IDesignFillBasis,
	type IDesignAttributesFill,
} from './definitions'
import { type IDesignFillCreateData } from './definitions.create'

export const FillBasisTypeEnum = {
	DEFINED: 'defined', // exact hex value
	RANDOM: 'random', // random hex value
	PALETTE_SELECTED: 'palette-selected', // first palette in array
	PALETTE_RANDOM: 'palette-random', // random palette in array
	PALETTE_LOOP: 'palette-loop', // loop palette array by index
	PALETTE_LOOP_REVERSE: 'palette-loop-reverse', // loop reversed palette array by index
	PIXEL: 'pixel', // pixel color
	// add more basis types here
} as const
export const FillStyleTypeEnum = {
	SOLID: 'solid', // flat color
	NONE: 'none', // no fill
	// add more styles here, like gradient, pattern, etc.
} as const
export type fillBasisTypeEnum = ObjectValues<typeof FillBasisTypeEnum>
export type fillStyleTypeEnum = ObjectValues<typeof FillStyleTypeEnum>

export const FillBasisSchema: ZodType<IDesignFillBasis> =
	z.nativeEnum(FillBasisTypeEnum)
export const FillStyleSchema: ZodType<IDesignFillStyle> =
	z.nativeEnum(FillStyleTypeEnum)

// use this to (de)serealize data to/from the db
// when adding attributes to an design type,
// make sure it starts as optional or is set to a default value
// for when parsing the design from the deserializer
export const DesignAttributesFillDefaultSchema: ZodType<IDesignAttributesFill> =
	z.object({
		basis: FillBasisSchema.default(FillBasisTypeEnum.DEFINED),
		style: FillStyleSchema.default(FillStyleTypeEnum.SOLID),
		value: HexcodeSchema.default('000000'),
	}) as ZodType<IDesignAttributesFill>

export const DesignAttributesFillSchema: ZodType<IDesignAttributesFill> =
	z.object({
		basis: FillBasisSchema,
		style: FillStyleSchema,
		value: HexcodeSchema,
	}) as ZodType<IDesignAttributesFill>

export const DesignFillDataSchema = z
	.object({
		type: z.literal(DesignTypeEnum.FILL),
		attributes: DesignAttributesFillSchema,
	})
	.merge(DesignDataSchema) satisfies ZodType<IDesignFillCreateData>
