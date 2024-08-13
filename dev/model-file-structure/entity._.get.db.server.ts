import { invariant } from '@epic-web/invariant'
import { z } from 'zod'
import {
	type IExampleEntity,
	type IExampleEntityWithChildren,
} from './entity._._definitions'

export type queryExampleEntityWhereArgsType = z.infer<typeof whereArgs>
const whereArgs = z.object({
	id: z.string().optional(),
	name: z.string().optional(),
	ownerId: z.string().optional(),
	exampleEntityId: z.string().optional(),
})

// TODO: Add schemas for each type of query and parse with zod
// aka if by id that should be present, if by slug that should be present
// owner id should be present unless admin (not set up yet)
const isLinkedListModel = false
export const validateQueryWhereArgsPresent = (
	where: queryExampleEntityWhereArgsType,
) => {
	const nullValuesAllowed: string[] = isLinkedListModel
		? ['nextId', 'prevId']
		: []
	const missingValues: Record<string, any> = {}
	for (const [key, value] of Object.entries(where)) {
		const valueIsNull = value === null || value === undefined
		const nullValueAllowed = nullValuesAllowed.includes(key)
		if (valueIsNull && !nullValueAllowed) {
			missingValues[key] = value
		}
	}

	if (Object.keys(missingValues).length > 0) {
		console.log('Missing values:', missingValues)
		throw new Error(
			'Null or undefined values are not allowed in query parameters for [example entity].',
		)
	}
}

export const getExampleEntities = ({
	where,
}: {
	where: queryExampleEntityWhereArgsType
}): Promise<IExampleEntity[]> => {
	validateQueryWhereArgsPresent(where)
	// return prisma.exampleEntity.findMany({
	// 	where,
	// })
	return Promise.resolve([
		{
			id: '1',
			name: 'Example Entity',
			description: 'Example description',
			createdAt: new Date(),
			updatedAt: new Date(),
			ownerId: '1',
			exampleEntityId: '1',
		},
	])
}

export const getExampleEntity = ({
	where,
}: {
	where: queryExampleEntityWhereArgsType
}): Promise<IExampleEntity | null> => {
	validateQueryWhereArgsPresent(where)
	// return prisma.exampleEntity.findFirst({
	// 	where,
	// })
	return Promise.resolve({
		id: '1',
		name: 'Example Entity',
		description: 'Example description',
		visible: true,
		createdAt: new Date(),
		updatedAt: new Date(),
		ownerId: '1',
		exampleEntityId: '1',
	})
}

export const verifyExampleEntity = async ({
	where,
}: {
	where: queryExampleEntityWhereArgsType
}): Promise<IExampleEntity | null> => {
	validateQueryWhereArgsPresent(where)
	// const artworkVersion = await prisma.exampleEntity.findFirst({
	// 	where,
	// })
	const exampleEntity = await getExampleEntity({ where })
	invariant(exampleEntity, 'Example Entity not found')
	return exampleEntity
}

export const getExampleEntityWithChildren = async ({
	where,
}: {
	where: queryExampleEntityWhereArgsType
}): Promise<IExampleEntityWithChildren | null> => {
	validateQueryWhereArgsPresent(where)
	// const artworkVersion = await prisma.artworkVersion.findFirst({
	// 	where,
	// 	include: artworkVersionChildren,
	// })
	const exampleEntityWithChildren = {
		id: '1',
		name: 'Example Entity',
		description: 'Example description',
		visible: true,
		createdAt: new Date(),
		updatedAt: new Date(),
		ownerId: '1',
		exampleEntityId: '1',
		children: [
			{
				id: '1',
				name: 'Example Entity',
				description: 'Example description',
				visible: true,
				createdAt: new Date(),
				updatedAt: new Date(),
				ownerId: '1',
				exampleEntityId: '1',
			},
		],
		children2: [],
	}
	invariant(exampleEntityWithChildren, 'Example Entity not found')
	return exampleEntityWithChildren
}
