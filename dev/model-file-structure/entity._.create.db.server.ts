import { type IExampleEntity } from './entity._._definitions'
import { type IExampleEntityParentCreateData } from './entity._.create.definitions'

export const createExampleEntity = ({
	data,
}: {
	data: IExampleEntityParentCreateData
}) => {
	// return prisma.exampleEntity.create({ data })
	return Promise.resolve({
		...data,
		id: '123',
		createdAt: new Date(),
		updatedAt: new Date(),
	} as IExampleEntity)
}
