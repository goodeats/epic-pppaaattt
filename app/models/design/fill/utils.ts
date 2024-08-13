import { ZodError } from 'zod'
import { type IDesignAttributesFill } from './definitions'
import { DesignAttributesFillSchema } from './schema'

export const parseDesignFillAttributes = (
	attributes: string,
): IDesignAttributesFill => {
	try {
		return DesignAttributesFillSchema.parse(JSON.parse(attributes))
	} catch (error: any) {
		if (error instanceof ZodError) {
			throw new Error(
				`Validation failed for design fill: ${error.errors.map(e => e.message).join(', ')}`,
			)
		} else {
			throw new Error(
				`Unexpected error during validation for design fill: ${error.message}`,
			)
		}
	}
}

export const stringifyDesignFillAttributes = (
	attributes: IDesignAttributesFill,
): string => {
	try {
		return JSON.stringify(DesignAttributesFillSchema.parse(attributes))
	} catch (error: any) {
		if (error instanceof ZodError) {
			throw new Error(
				`Validation failed for design fill: ${error.errors.map(e => e.message).join(', ')}`,
			)
		} else {
			throw new Error(
				`Unexpected error during validation for design fill: ${error.message}`,
			)
		}
	}
}
