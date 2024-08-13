import { type IDesign } from '#app/models/design/definitions'
import { type IDesignTypeCreateOverrides } from '#app/models/design/definitions.create'
import { RotateDataSchema } from '#app/schema/rotate'
import { prisma } from '#app/utils/db.server'

export interface IRotateCreateOverrides {
	value?: number
	basis?: string
}

export const createDesignRotate = ({
	designId,
	designTypeOverrides,
}: {
	designId: IDesign['id']
	designTypeOverrides: IDesignTypeCreateOverrides
}) => {
	const rotateData = {
		designId,
		...(designTypeOverrides as IRotateCreateOverrides),
	}
	const data = RotateDataSchema.parse(rotateData)

	return prisma.rotate.create({ data })
}
