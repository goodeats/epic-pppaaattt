import {
	type AppearanceType,
	appearanceMapping,
	type AppearanceValuesMap,
} from '#app/utils/appearances'
import { prisma } from '#app/utils/db.server'
import { stringToSlug } from '#app/utils/misc'

export const updateArtboardDimensions = async (
	userId: string,
	artboardId: string | undefined,
	width: number,
	height: number,
) => {
	return await prisma.artboard.update({
		select: { id: true },
		where: { id: artboardId, ownerId: userId },
		data: {
			width,
			height,
		},
	})
}

export const updateArtboardBackgroundColor = async (
	userId: string,
	artboardId: string | undefined,
	backgroundColor: string,
) => {
	return await prisma.artboard.update({
		select: { id: true },
		where: { id: artboardId, ownerId: userId },
		data: {
			backgroundColor,
		},
	})
}

export const updateArtboardAppearancesAdd = async (
	userId: string,
	artboardId: string,
	appearanceIds: string[],
) => {
	// Start a transaction
	return await prisma.$transaction(async prisma => {
		// get artboard
		const artboard = await await prisma.artboard.findFirst({
			where: { id: artboardId, ownerId: userId },
			select: { id: true, slug: true, owner: { select: { username: true } } },
		})
		if (!artboard) {
			throw new Error('Artboard not found')
		}

		// Verify appearances exist and belong to the user
		const verifiedAppearances = await prisma.appearance.findMany({
			where: { ownerId: userId, id: { in: appearanceIds } },
			select: {
				id: true,
				name: true,
				slug: true,
				owner: { select: { username: true } },
			},
		})
		const verifiedAppearanceIds = verifiedAppearances.map(
			appearance => appearance.id,
		)

		// Get existing appearances on the artboard
		const existingArtboardAppearances =
			await prisma.appearancesOnArtboards.findMany({
				where: { artboardId },
				select: { appearanceId: true, order: true },
				orderBy: { order: 'asc' },
			})
		const existingArtboardAppearanceIds = existingArtboardAppearances.map(
			({ appearanceId }) => appearanceId,
		)

		// Determine new and appearances to remove
		const appearancesToAdd = verifiedAppearanceIds.filter(
			id => !existingArtboardAppearanceIds.includes(id),
		)
		const appearancesToRemove = existingArtboardAppearanceIds.filter(
			id => !verifiedAppearanceIds.includes(id),
		)

		// Calculate the starting index for new appearances
		const maxOrder =
			existingArtboardAppearances.length > 0
				? existingArtboardAppearances[existingArtboardAppearances.length - 1]
						.order
				: -1
		let newAppearanceOrderStart = maxOrder + 1 - appearancesToRemove.length

		// Add new appearances to the artboard
		const addAppearancesPromises = appearancesToAdd.map(appearanceId => {
			return prisma.appearancesOnArtboards.create({
				data: { artboardId, appearanceId, order: newAppearanceOrderStart++ },
			})
		})

		// Remove unchecked appearances from the artboard
		const removeAppearancesPromise = appearancesToRemove.map(appearanceId => {
			return prisma.appearancesOnArtboards.deleteMany({
				where: { artboardId, appearanceId },
			})
		})

		// Update order for remaining appearances
		const updateOrderPromises = existingArtboardAppearances
			.filter(({ appearanceId }) => !appearancesToRemove.includes(appearanceId))
			.map((appearance, index) => {
				return prisma.appearancesOnArtboards.updateMany({
					where: { artboardId, appearanceId: appearance.appearanceId },
					data: { order: index },
				})
			})

		// Execute all operations
		await Promise.all([
			...addAppearancesPromises,
			...removeAppearancesPromise,
			...updateOrderPromises,
		])

		// Return the updated artboard
		return await prisma.artboard.findFirst({
			where: { id: artboardId, ownerId: userId },
			select: { id: true, slug: true, owner: { select: { username: true } } },
		})
	})
}

export const addArtboardAppearances = async (
	userId: string,
	artboardId: string,
	appearanceIds: string[],
) => {
	// Start a transaction
	return await prisma.$transaction(async prisma => {
		// get artboard
		const artboard = await await prisma.artboard.findFirst({
			where: { id: artboardId, ownerId: userId },
			select: { id: true, slug: true, owner: { select: { username: true } } },
		})
		if (!artboard) {
			throw new Error('Artboard not found')
		}

		// Verify appearances exist and belong to the user
		const verifiedAppearances = await prisma.appearance.findMany({
			where: { ownerId: userId, id: { in: appearanceIds } },
			select: {
				id: true,
				name: true,
				slug: true,
				owner: { select: { username: true } },
			},
		})
		const verifiedAppearanceIds = verifiedAppearances.map(
			appearance => appearance.id,
		)

		// Get existing appearances on the artboard
		const existingArtboardAppearances =
			await prisma.appearancesOnArtboards.findMany({
				where: { artboardId },
				select: { appearanceId: true, order: true },
				orderBy: { order: 'asc' },
			})
		const existingArtboardAppearanceIds = existingArtboardAppearances.map(
			({ appearanceId }) => appearanceId,
		)

		// Determine new appearances to add
		const appearancesToAdd = verifiedAppearanceIds.filter(
			id => !existingArtboardAppearanceIds.includes(id),
		)

		// Calculate the starting index for new appearances
		const maxOrder =
			existingArtboardAppearances.length > 0
				? existingArtboardAppearances[existingArtboardAppearances.length - 1]
						.order
				: -1
		let newAppearanceOrderStart = maxOrder + 1

		// Add new appearances to the artboard
		const addAppearancesPromises = appearancesToAdd.map(appearanceId => {
			return prisma.appearancesOnArtboards.create({
				data: { artboardId, appearanceId, order: newAppearanceOrderStart++ },
			})
		})

		// Update order for remaining appearances
		const updateOrderPromises = existingArtboardAppearances.map(
			(appearance, index) => {
				return prisma.appearancesOnArtboards.updateMany({
					where: { artboardId, appearanceId: appearance.appearanceId },
					data: { order: index },
				})
			},
		)

		// Execute all operations
		await Promise.all([...addAppearancesPromises, ...updateOrderPromises])

		// Return the updated artboard
		return await prisma.artboard.findFirst({
			where: { id: artboardId, ownerId: userId },
			select: { id: true, slug: true, owner: { select: { username: true } } },
		})
	})
}

export const removeArtboardAppearance = async (
	userId: string,
	artboardId: string,
	appearanceId: string,
) => {
	// Start a transaction
	return await prisma.$transaction(async prisma => {
		// get artboard
		const artboard = await await prisma.artboard.findFirst({
			where: { id: artboardId, ownerId: userId },
			select: { id: true, slug: true, owner: { select: { username: true } } },
		})
		if (!artboard) {
			throw new Error('Artboard not found')
		}

		// Get existing appearances on the artboard
		const existingArtboardAppearances =
			await prisma.appearancesOnArtboards.findMany({
				where: { artboardId },
				select: { appearanceId: true, order: true },
				orderBy: { order: 'asc' },
			})

		// remove appearance from the artboard
		await prisma.appearancesOnArtboards.deleteMany({
			where: { artboardId, appearanceId },
		})

		// Update order for remaining appearances
		const updateOrderPromises = existingArtboardAppearances.map(
			(appearance, index) => {
				return prisma.appearancesOnArtboards.updateMany({
					where: { artboardId, appearanceId: appearance.appearanceId },
					data: { order: index },
				})
			},
		)

		// Execute all operations
		await Promise.all([...updateOrderPromises])

		// Return the updated artboard
		return await prisma.artboard.findFirst({
			where: { id: artboardId, ownerId: userId },
			select: { id: true, slug: true, owner: { select: { username: true } } },
		})
	})
}

// panel form mutations

export const createArtboardAppearance = async (
	userId: string,
	artboardId: string,
	appearanceType: string,
) => {
	// Start a transaction
	return await prisma.$transaction(async prisma => {
		// get artboard
		const artboard = await await prisma.artboard.findFirst({
			where: { id: artboardId, ownerId: userId },
			select: { id: true, slug: true, owner: { select: { username: true } } },
		})
		if (!artboard) {
			throw new Error('Artboard not found')
		}

		// get appearance default values by type
		const appearanceTypeDefaultValues =
			appearanceMapping[appearanceType as AppearanceType].defaultValues

		// Get existing appearances on the artboard
		const existingArtboardAppearances =
			await prisma.appearancesOnArtboards.findMany({
				where: { artboardId },
				select: { appearanceId: true, order: true },
				orderBy: { order: 'asc' },
			})

		// Calculate the starting index for new appearance
		const newAppearanceOrderStart = existingArtboardAppearances.length

		// create new appearance
		const name = `${appearanceType}-${new Date().getTime()}`
		const slug = stringToSlug(name)
		const newAppearance = await prisma.appearance.create({
			data: {
				name,
				slug,
				type: appearanceType,
				value: JSON.stringify(appearanceTypeDefaultValues),
				ownerId: userId,
			},
		})
		if (!newAppearance) {
			throw new Error('Failed to create appearance')
		}

		// add new appearance to the artboard
		await prisma.appearancesOnArtboards.create({
			data: {
				artboardId,
				appearanceId: newAppearance.id,
				order: newAppearanceOrderStart,
			},
		})

		// Return the new appearance
		return await prisma.appearance.findFirst({
			where: { id: newAppearance.id },
			select: {
				id: true,
				type: true,
				value: true,
			},
		})
	})
}

export const deleteArtboardAppearance = async (
	userId: string,
	artboardId: string,
	appearanceId: string,
) => {
	// Start a transaction
	return await prisma.$transaction(async prisma => {
		// get artboard
		const artboard = await await prisma.artboard.findFirst({
			where: { id: artboardId, ownerId: userId },
			select: { id: true, slug: true, owner: { select: { username: true } } },
		})
		if (!artboard) {
			throw new Error('Artboard not found')
		}

		// Get existing appearances on the artboard
		const existingArtboardAppearances =
			await prisma.appearancesOnArtboards.findMany({
				where: { artboardId },
				select: { appearanceId: true, order: true },
				orderBy: { order: 'asc' },
			})

		// remove appearance that only belonged to the artboard
		await prisma.appearance.deleteMany({
			where: { id: appearanceId, ownerId: userId },
		})

		// Update order for remaining appearances
		const updateOrderPromises = existingArtboardAppearances.map(
			(appearance, index) => {
				return prisma.appearancesOnArtboards.updateMany({
					where: { artboardId, appearanceId: appearance.appearanceId },
					data: { order: index },
				})
			},
		)

		// Execute all operations
		await Promise.all([...updateOrderPromises])

		// Return the updated artboard
		return await prisma.artboard.findFirst({
			where: { id: artboardId, ownerId: userId },
			select: { id: true, slug: true, owner: { select: { username: true } } },
		})
	})
}

export const toggleArtboardAppearanceVisibility = async (
	userId: string,
	artboardId: string,
	appearanceId: string,
) => {
	// Start a transaction
	return await prisma.$transaction(async prisma => {
		// get artboard
		const artboard = await await prisma.artboard.findFirst({
			where: { id: artboardId, ownerId: userId },
			select: { id: true, slug: true, owner: { select: { username: true } } },
		})
		if (!artboard) {
			throw new Error('Artboard not found')
		}

		// get artboard appearance
		const artboardAppearance = await prisma.appearancesOnArtboards.findFirst({
			where: { artboardId, appearanceId },
			select: { isVisible: true },
		})
		if (!artboardAppearance) {
			throw new Error('Appearance not found on artboard')
		}

		// toggle appearance visibility
		await prisma.appearancesOnArtboards.updateMany({
			where: { artboardId, appearanceId },
			data: { isVisible: !artboardAppearance.isVisible },
		})

		// Return the updated artboard
		return await prisma.artboard.findFirst({
			where: { id: artboardId, ownerId: userId },
			select: { id: true, slug: true, owner: { select: { username: true } } },
		})
	})
}

export const updateArtboardAppearanceValue = async (
	userId: string,
	appearanceId: string,
	value: string,
) => {
	// Start a transaction
	return await prisma.$transaction(async prisma => {
		// get appearance
		const appearance = await await prisma.appearance.findFirst({
			where: { id: appearanceId, ownerId: userId },
			select: {
				id: true,
				value: true,
				slug: true,
				type: true,
				owner: { select: { username: true } },
			},
		})
		if (!appearance) {
			throw new Error('Appearance not found')
		}

		// get current appearance value
		const appearanceType = appearance.type as AppearanceType
		const currentValue = JSON.parse(
			appearance.value,
		) as AppearanceValuesMap[typeof appearanceType]

		const newValue = {
			...currentValue,
			value,
		}
		// update appearance value
		await prisma.appearance.updateMany({
			where: { id: appearanceId, ownerId: userId },
			data: { value: JSON.stringify(newValue) },
		})

		// Return the updated appearance
		return await prisma.appearance.findFirst({
			where: { id: appearanceId, ownerId: userId },
			select: { id: true, slug: true, owner: { select: { username: true } } },
		})
	})
}

export const updateArtboardAppearanceOrder = async (
	userId: string,
	artboardId: string,
	appearanceId: string,
	appearanceType: AppearanceType,
	direction: 'up' | 'down',
) => {
	// Start a transaction
	return await prisma.$transaction(async prisma => {
		// get artboard
		const artboard = await await prisma.artboard.findFirst({
			where: { id: artboardId, ownerId: userId },
			select: { id: true, slug: true, owner: { select: { username: true } } },
		})
		if (!artboard) {
			throw new Error('Artboard not found')
		}

		// get appearance on artboard
		const artboardAppearance =
			await await prisma.appearancesOnArtboards.findFirst({
				where: { appearanceId: appearanceId },
				select: {
					id: true,
					order: true,
					appearance: { select: { value: true } },
				},
			})
		if (!artboardAppearance) {
			throw new Error('Appearance not found on artboard')
		}

		console.log(
			'artboardAppearance',
			artboardAppearance.order,
			artboardAppearance.appearance.value,
		)

		// get other appearance on the artboard
		const otherArtboardAppearance =
			await prisma.appearancesOnArtboards.findFirst({
				where: {
					artboardId,
					appearance: { type: appearanceType },
					order:
						direction === 'up'
							? { lt: artboardAppearance.order }
							: { gt: artboardAppearance.order },
				},
				select: {
					id: true,
					order: true,
					appearance: { select: { value: true } },
				},
				orderBy: { order: direction === 'up' ? 'desc' : 'asc' },
			})
		if (!otherArtboardAppearance) {
			return
		}

		console.log(
			'otherArtboardAppearance',
			otherArtboardAppearance.order,
			otherArtboardAppearance.appearance.value,
		)

		// update appearance order
		await prisma.appearancesOnArtboards.updateMany({
			where: { id: artboardAppearance.id },
			data: { order: otherArtboardAppearance.order },
		})

		// update other appearance order
		await prisma.appearancesOnArtboards.updateMany({
			where: { id: otherArtboardAppearance.id },
			data: { order: artboardAppearance.order },
		})

		// Return the updated artboard
		return await prisma.artboard.findFirst({
			where: { id: artboardId, ownerId: userId },
			select: { id: true, slug: true, owner: { select: { username: true } } },
		})
	})
}
