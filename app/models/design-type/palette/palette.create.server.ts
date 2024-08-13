import { type IDesign } from '#app/models/design/definitions'
import { type IDesignTypeCreateOverrides } from '#app/models/design/definitions.create'
import { PaletteDataSchema } from '#app/schema/palette'
import { prisma } from '#app/utils/db.server'

export interface IPaletteCreateOverrides {
	format?: string
	value?: string
	opacity?: number
}

export const createDesignPalette = ({
	designId,
	designTypeOverrides,
}: {
	designId: IDesign['id']
	designTypeOverrides: IDesignTypeCreateOverrides
}) => {
	const paletteData = {
		designId,
		...(designTypeOverrides as IPaletteCreateOverrides),
	}
	const data = PaletteDataSchema.parse(paletteData)

	return prisma.palette.create({ data })
}
