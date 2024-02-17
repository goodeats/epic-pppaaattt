import { prisma } from '#app/utils/db.server'

export const getOwner = async (userId: string) => {
	return await prisma.user.findFirst({
		select: {
			id: true,
			name: true,
			username: true,
			image: { select: { id: true } },
			artboards: { select: { id: true, slug: true, name: true } },
		},
		where: { id: userId },
	})
}

export const getArtboard = async (userId: string, artboardId: string) => {
	return await prisma.artboard.findFirst({
		where: { id: artboardId, ownerId: userId },
		select: {
			id: true,
			name: true,
			description: true,
			slug: true,
			width: true,
			height: true,
			backgroundColor: true,
			updatedAt: true,
			project: {
				select: {
					id: true,
					name: true,
					slug: true,
				},
			},
			appearances: {
				select: {
					order: true,
					isVisible: true,
					overrideValue: true,
					artboardId: true,
					appearance: {
						select: {
							id: true,
							name: true,
							description: true,
							slug: true,
							type: true,
							value: true,
							updatedAt: true,
						},
					},
				},
				orderBy: {
					order: 'asc',
				},
			},
		},
	})
}

export const getAppearances = async (userId: string) => {
	const appearances = await prisma.appearance.findMany({
		where: { ownerId: userId },
		select: {
			id: true,
			name: true,
			slug: true,
			type: true,
			owner: { select: { username: true } },
		},
		orderBy: { updatedAt: 'asc' },
	})
	return appearances
}
