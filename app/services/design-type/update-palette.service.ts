import { type IDesign } from '#app/models/design/definitions'
import { type IPalette } from '#app/models/design-type/palette/palette.server'
import {
	type IDesignTypePaletteUpdatedResponse,
	updateDesignTypePaletteValue,
} from '#app/models/design-type/palette/palette.update.server'
import { type IUser } from '#app/models/user/user.server'

export const updateDesignTypePaletteValueService = async ({
	id,
	designId,
	value,
}: {
	userId: IUser['id']
	id: IPalette['id']
	designId: IDesign['id']
	value: number
}): Promise<IDesignTypePaletteUpdatedResponse> => {
	try {
		return await updateDesignTypePaletteValue({
			id,
			designId,
			value,
		})
		// later will be adding Activity class
		// i.e, edit history so you can undo changes and/or see who made them
	} catch (error) {
		console.log('updateDesignTypePaletteValueService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}
