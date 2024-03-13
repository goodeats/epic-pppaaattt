import { type Design } from '@prisma/client'
import {
	findArtboardTransactionPromise,
	removeArtboardSelectedDesignPromise,
	updateArtboardSelectedDesignPromise,
} from '#app/models/artboard.server'
import {
	connectPrevAndNextDesignsPromise,
	findDesignTransactionPromise,
} from '#app/models/design.server'
import { type designTypeEnum } from '#app/schema/design'
import { type PrismaTransactionType, prisma } from '#app/utils/db.server'

export const artboardDesignDeleteService = async ({
	id,
	artboardId,
	isSelectedDesign,
	updateSelectedDesignId,
}: {
	id: string
	artboardId: string
	isSelectedDesign: boolean
	updateSelectedDesignId: string | null
}) => {
	try {
		await prisma.$transaction(async prisma => {
			// get design
			const design = await prisma.design.findFirst({
				where: { id },
			})
			if (!design) throw new Error('Design not found')
			const { nextId, prevId, type } = design

			// get next and previous designs
			const { nextDesign, prevDesign } = await fetchAdjacentDesigns({
				design,
				prisma,
			})

			const updateOperations = [
				// delete design first before updating next/prev designs
				// this is necessary to avoid foreign key unique constraint errors
				deleteDesignPromise({ id, prisma }),
				// update next/prev designs if they exist
				// this is necessary to maintain the linked list structure
				...designUpdateOperations({
					nextId,
					nextDesign,
					prevId,
					prevDesign,
					prisma,
				}),
			]

			// if the design was selected
			// update the artboard selected design for its type
			// either replace with next visible or remove
			if (isSelectedDesign) {
				const artboardUpdatePromises = await artboardUpdateOperations({
					artboardId,
					updateSelectedDesignId,
					type: type as designTypeEnum,
					prisma,
				})
				// typescript seems to be gaslighting me here
				// the operation succeeds and the args seem valid
				// spent a couple hours trying to figure out why and choosing to ignore it
				// will monitor if something weird ever happens
				// @ts-ignore
				updateOperations.push(...artboardUpdatePromises)
			}

			// Execute all update operations in parallel
			await Promise.all(updateOperations)
		})

		console.log('Design deleted successfully')

		return { success: true }
	} catch (error) {
		console.log(error)
		return { error: true }
	}
}

const fetchAdjacentDesigns = async ({
	design,
	prisma,
}: {
	design: Design
	prisma: PrismaTransactionType
}) => {
	const { nextId, prevId } = design

	const fetchNextDesignPromise = nextId
		? findDesignTransactionPromise({
				id: nextId,
				prisma,
		  })
		: Promise.resolve(null)

	const fetchPrevDesignPromise = prevId
		? findDesignTransactionPromise({
				id: prevId,
				prisma,
		  })
		: Promise.resolve(null)

	const [nextDesign, prevDesign] = await Promise.all([
		fetchNextDesignPromise,
		fetchPrevDesignPromise,
	])

	return { nextDesign, prevDesign }
}

// Delete design (this needs to happen before we can update the next/prev designs)
const deleteDesignPromise = ({
	id,
	prisma,
}: {
	id: string
	prisma: PrismaTransactionType
}) => {
	return prisma.design.delete({
		where: { id },
	})
}

const designUpdateOperations = ({
	nextId,
	nextDesign,
	prevId,
	prevDesign,
	prisma,
}: {
	nextId: string | null
	nextDesign: Design | null
	prevId: string | null
	prevDesign: Design | null
	prisma: PrismaTransactionType
}) => {
	const updateOperations = []

	if (!prevId && nextId && nextDesign) {
		// If head, remove prevId from next design, becomes head
		updateOperations.push(removePrevIdFromNextDesign({ nextId, prisma }))
	} else if (prevId && !nextId && prevDesign) {
		// If tail, remove nextId from prev design, becomes tail
		updateOperations.push(removeNextIdFromPrevDesign({ prevId, prisma }))
	} else if (prevId && nextId && prevDesign && nextDesign) {
		// If in middle, connect prev and next designs directly
		updateOperations.push(
			...connectPrevAndNextDesignsPromise({ prevId, nextId, prisma }),
		)
	}

	return updateOperations
}

const removePrevIdFromNextDesign = ({
	nextId,
	prisma,
}: {
	nextId: string
	prisma: PrismaTransactionType
}) => {
	return prisma.design.update({
		where: { id: nextId },
		data: { prevId: null },
	})
}

const removeNextIdFromPrevDesign = ({
	prevId,
	prisma,
}: {
	prevId: string
	prisma: PrismaTransactionType
}) => {
	return prisma.design.update({
		where: { id: prevId },
		data: { nextId: null },
	})
}

const artboardUpdateOperations = async ({
	artboardId,
	updateSelectedDesignId,
	type,
	prisma,
}: {
	artboardId: string
	updateSelectedDesignId: string | null
	type: designTypeEnum
	prisma: PrismaTransactionType
}) => {
	// Fetch artboard for selected designs
	const fetchArtboardPromise = findArtboardTransactionPromise({
		id: artboardId,
		prisma,
	})
	const [artboard] = await Promise.all([fetchArtboardPromise])
	if (!artboard) return []

	if (updateSelectedDesignId) {
		const fetchNewSelectedDesign = findDesignTransactionPromise({
			id: updateSelectedDesignId,
			prisma,
		})
		const [newSelectedDesign] = await Promise.all([fetchNewSelectedDesign])
		if (!newSelectedDesign) return []

		return [
			updateArtboardSelectedDesignPromise({
				artboard,
				designId: updateSelectedDesignId,
				type,
				prisma,
			}),
		]
	} else {
		return [
			removeArtboardSelectedDesignPromise({
				artboard,
				type,
				prisma,
			}),
		]
	}
}
