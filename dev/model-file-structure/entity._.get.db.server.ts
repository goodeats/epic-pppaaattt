import { invariant } from '@epic-web/invariant'
import { type z } from 'zod'
import {
	type IExampleEntity,
	type IExampleEntityWithChildren,
} from './entity._._definitions'

const exampleEntityRecord = {
	id: '1',
	name: 'Example Entity',
	description: 'Example description',
	visible: true,
	createdAt: new Date(),
	updatedAt: new Date(),
	ownerId: '1',
	exampleEntityId: '1',
} as IExampleEntity

export type queryExampleEntityWhereArgsType = z.infer<
	z.ZodObject<{
		id: z.ZodOptional<z.ZodString>
		name: z.ZodOptional<z.ZodString>
		ownerId: z.ZodOptional<z.ZodString>
		exampleEntityId: z.ZodOptional<z.ZodString>
	}>
>

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
	// return prisma.exampleEntityRecord.findMany({
	// 	where,
	// })
	return Promise.resolve([exampleEntityRecord])
}

export const getExampleEntity = ({
	where,
}: {
	where: queryExampleEntityWhereArgsType
}): Promise<IExampleEntity | null> => {
	validateQueryWhereArgsPresent(where)
	// return prisma.exampleEntityRecord.findFirst({
	// 	where,
	// })
	return Promise.resolve(exampleEntityRecord)
}

export const verifyExampleEntity = async ({
	where,
}: {
	where: queryExampleEntityWhereArgsType
}): Promise<IExampleEntity | null> => {
	validateQueryWhereArgsPresent(where)
	// const artworkVersion = await prisma.exampleEntityRecord.findFirst({
	// 	where,
	// })
	const exampleEntityRecord = await getExampleEntity({ where })
	invariant(exampleEntityRecord, 'Example Entity not found')
	return exampleEntityRecord
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
		...exampleEntityRecord,
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
