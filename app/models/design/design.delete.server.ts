import { prisma } from '#app/utils/db.server'
import { type IDesignDeleteParams } from './definitions.delete'

export const deleteDesign = ({ id, ownerId }: IDesignDeleteParams) => {
	return prisma.design.delete({
		where: { id, ownerId },
	})
}
