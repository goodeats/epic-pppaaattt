import { z } from 'zod'
import { HexcodeSchema } from '#app/schema/colors'
import { FillBasisSchema, FillStyleSchema } from './schema'

export const EditDesignFillBasisSchema = z.object({
	id: z.string(),
	basis: FillBasisSchema,
})

export const EditDesignFillStyleSchema = z.object({
	id: z.string(),
	style: FillStyleSchema,
})

export const EditDesignFillValueSchema = z.object({
	id: z.string(),
	value: HexcodeSchema,
})
