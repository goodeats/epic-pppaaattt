import { DesignTypeEnum } from '#app/models/design/definitions'
import { prisma } from '#app/utils/db.server'
import { type IDesignFillUpdateParams } from './definitions.update'
import { stringifyDesignFillAttributes } from './utils'

export const updateDesignFillAttributes = ({
	id,
	ownerId,
	data,
}: IDesignFillUpdateParams) => {
	const { attributes } = data
	const jsonAttributes = stringifyDesignFillAttributes(attributes)
	return prisma.design.update({
		where: { id, ownerId, type: DesignTypeEnum.FILL },
		data: {
			attributes: jsonAttributes,
		},
	})
}
