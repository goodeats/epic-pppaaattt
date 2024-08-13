import { type IDesign } from '#app/models/design/definitions'
import { IDesignTypeCreateOverrides } from '#app/models/design/definitions.create'
import { LineDataSchema } from '#app/schema/line'
import { prisma } from '#app/utils/db.server'

export interface ILineCreateOverrides {
	width?: number
	basis?: string
	format?: string
}

export const createDesignLine = ({
	designId,
	designTypeOverrides,
}: {
	designId: IDesign['id']
	designTypeOverrides: IDesignTypeCreateOverrides
}) => {
	const lineData = {
		designId,
		...(designTypeOverrides as ILineCreateOverrides),
	}
	const data = LineDataSchema.parse(lineData)

	return prisma.line.create({ data })
}
