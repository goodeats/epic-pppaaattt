import { prisma } from '#app/utils/db.server'
import { IDesignParentCreateData } from './definitions.create'
import { stringifyDesignAttributes } from './utils'

export const createDesign = ({ data }: { data: IDesignParentCreateData }) => {
	const { attributes, ...rest } = data
	const jsonAttributes = stringifyDesignAttributes({
		type: data.type,
		attributes,
	})
	const serializedData = { ...rest, attributes: jsonAttributes }
	return prisma.design.create({ data: serializedData })
}
