import { type IDesign } from '#app/models/design/definitions'
import { type IDesignTypeCreateOverrides } from '#app/models/design/definitions.create'
import { FillDataSchema } from '#app/schema/fill'
import { prisma } from '#app/utils/db.server'

export interface IFillCreateOverrides {
	style?: string
	value?: string
	basis?: string
}

export const createDesignFill = ({
	designId,
	designTypeOverrides,
}: {
	designId: IDesign['id']
	designTypeOverrides: IDesignTypeCreateOverrides
}) => {
	const fillData = {
		designId,
		...(designTypeOverrides as IFillCreateOverrides),
	}
	const data = FillDataSchema.parse(fillData)

	return prisma.fill.create({ data })
}
