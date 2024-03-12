import { type Design, type Artboard } from '@prisma/client'
import { type User } from '@sentry/remix'
import { findArtboardTransactionPromise } from '#app/models/artboard.server'
import {
	ArtboardSelectedDesignsSchema,
	type ArtboardSelectedDesignsType,
} from '#app/schema/artboard'
import { designSchema, type designTypeEnum } from '#app/schema/design'
import { type PrismaTransactionType, prisma } from '#app/utils/db.server'

type artboardDesignCreateServiceProps = {
	userId: User['id']
	artboardId: Artboard['id']
	type: designTypeEnum
	visibleDesignsCount: number
}

export const artboardDesignCreateService = async ({
	userId,
	artboardId,
	type,
	visibleDesignsCount,
}: artboardDesignCreateServiceProps) => {
	console.log('artboardDesignCreateService')
	try {
		await prisma.$transaction(async prisma => {
			// new designs are appended to the end of the list
			// find the last design in the list (tail) by type
			const previousDesign = await fetchArtboardDesignTypeTail({
				artboardId,
				type,
				prisma,
			})

			// create design before its associated type
			const design = await createDesign({
				userId,
				artboardId,
				type,
				prisma,
			})
			console.log('created design', design)
			// create the associated type
			const designType = await createDesignType({
				designId: design.id,
				type,
				prisma,
			})
			console.log('created design type', designType)

			const updateOperations = []

			// if the artboard already has a palette
			// link the new palette to the last one
			// and the last one to the new one
			if (previousDesign) {
				updateOperations.push(
					...connectPrevAndNextDesigns({
						prevId: previousDesign.id,
						nextId: design.id,
						prisma,
					}),
				)
				console.log('will connect design to previous tail')
			}

			if (visibleDesignsCount === 0) {
				// Fetch artboard for selected designs
				const fetchArtboardPromise = findArtboardTransactionPromise({
					id: artboardId,
					prisma,
				})

				// Execute fetch operations in parallel
				const [artboard] = await Promise.all([fetchArtboardPromise])
				if (artboard) {
					updateOperations.push(
						updateArtboardSelectedDesign({
							artboard,
							designId: design.id,
							type,
							prisma,
						}),
					)
					console.log('will update selected design for artboard')
				}
			}

			// Execute all update operations in parallel
			await Promise.all(updateOperations)
		})

		console.log('Design created successfully')

		return { success: true }
	} catch (error) {
		console.log(error)
		return { error: true }
	}
}

const fetchArtboardDesignTypeTail = async ({
	artboardId,
	type,
	prisma,
}: {
	artboardId: Artboard['id']
	type: designTypeEnum
	prisma: PrismaTransactionType
}) => {
	return await prisma.design.findFirst({
		where: { type, artboardId, nextId: null },
	})
}

const createDesign = async ({
	userId,
	artboardId,
	type,
	prisma,
}: {
	userId: User['id']
	artboardId: Artboard['id']
	type: designTypeEnum
	prisma: PrismaTransactionType
}) => {
	// validate the design type is valid
	const data = designSchema.parse({
		type,
		ownerId: userId,
		artboardId,
	})
	return await prisma.design.create({ data })
}

const createDesignType = async ({
	designId,
	type,
	prisma,
}: {
	designId: Design['id']
	type: designTypeEnum
	prisma: PrismaTransactionType
}) => {
	const data = { designId }

	// each design type has a default value set in the schema
	switch (type) {
		case 'palette':
			return await prisma.palette.create({ data })
		case 'size':
			return await prisma.size.create({ data })
		case 'fill':
			return await prisma.fill.create({ data })
		case 'stroke':
			return await prisma.stroke.create({ data })
		case 'line':
			return await prisma.line.create({ data })
		case 'rotate':
			return await prisma.rotate.create({ data })
		case 'layout':
			return await prisma.layout.create({ data })
		case 'template':
			return await prisma.template.create({ data })
	}
}

const connectPrevAndNextDesigns = ({
	prevId,
	nextId,
	prisma,
}: {
	prevId: Design['id']
	nextId: Design['id']
	prisma: PrismaTransactionType
}) => {
	return [
		prisma.design.update({
			where: { id: prevId },
			data: { nextId },
		}),
		prisma.design.update({
			where: { id: nextId },
			data: { prevId },
		}),
	]
}

const updateArtboardSelectedDesign = ({
	artboard,
	designId,
	type,
	prisma,
}: {
	artboard: Pick<Artboard, 'id' | 'selectedDesigns'>
	designId: Design['id']
	type: designTypeEnum
	prisma: PrismaTransactionType
}) => {
	// parse the selectedDesigns of the artboard
	const selectedDesigns = ArtboardSelectedDesignsSchema.parse(
		JSON.parse(artboard.selectedDesigns),
	) as ArtboardSelectedDesignsType

	// set the key for the selectedDesigns object to update
	const designKey = (type + 'Id') as keyof ArtboardSelectedDesignsType

	// build the updated selectedDesigns object
	const updatedSelectedDesigns = ArtboardSelectedDesignsSchema.parse({
		...selectedDesigns,
		[designKey]: designId,
	})

	// update the selectedDesigns for the artboard
	return prisma.artboard.update({
		where: { id: artboard.id },
		data: { selectedDesigns: JSON.stringify(updatedSelectedDesigns) },
	})
}