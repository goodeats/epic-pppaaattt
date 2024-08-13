import { prisma } from '#app/utils/db.server'

export const seedArtwork = async ({
	ownerId,
	projectId,
}: {
	ownerId: string
	projectId: string
}) => {
	console.time(`🐨 Created artwork`)

	await prisma.artwork.create({
		data: {
			name: 'My First Artwork',
			description: 'This is my first artwork. I am so excited to get started!',
			slug: 'my-first-artwork',
			ownerId,
			projectId,
			branches: {
				create: {
					description: 'Initial main branch for the seeded artwork.',
					default: true,
					active: true,
					owner: { connect: { id: ownerId } },
					versions: {
						create: {
							width: 1080, // 9
							height: 1920, // 16 aspect ratio
							background: 'F5F5F5',
							starred: true,
							published: true,
							owner: { connect: { id: ownerId } },
						},
					},
				},
			},
		},
		include: {
			branches: {
				include: {
					versions: true, // Include the versions of the branch to get its id
				},
			},
		},
	})
	// const artworkVersionId = createdArtwork.branches[0].versions[0].id
	console.timeEnd(`🐨 Created artwork`)

	console.time(`🎨 Created designs`)

	// red, green, blue palette
	// const paletteValues = ['FF0000', '00FF00', '0000FF']
	// async function processPaletteValues() {
	// 	for (const value of paletteValues) {
	// 		await artworkVersionDesignCreateService({
	// 			userId: ownerId,
	// 			artworkVersionId,
	// 			type: 'palette',
	// 			designTypeOverrides: {
	// 				value,
	// 			} as IPaletteCreateOverrides,
	// 		})
	// 	}
	// }
	// processPaletteValues().then(() => {
	// 	console.log('All palette values processed.')
	// })

	// await artworkVersionDesignCreateService({
	// 	userId: ownerId,
	// 	artworkVersionId,
	// 	type: 'size',
	// 	designTypeOverrides: {
	// 		format: 'percent',
	// 		basis: 'width',
	// 	} as ISizeCreateOverrides,
	// })

	// // fill for random palette colors
	// await artworkVersionDesignCreateService({
	// 	userId: ownerId,
	// 	artworkVersionId,
	// 	type: 'fill',
	// 	designTypeOverrides: {
	// 		basis: FillBasisTypeEnum.PALETTE_RANDOM,
	// 	} as ISizeCreateOverrides,
	// })

	// // fill for none as alternate when viewing in editor
	// await artworkVersionDesignCreateService({
	// 	userId: ownerId,
	// 	artworkVersionId,
	// 	type: 'fill',
	// 	designTypeOverrides: {
	// 		style: FillStyleTypeEnum.NONE,
	// 	} as IFillCreateOverrides,
	// })

	// // stroke for looping palette colors
	// await artworkVersionDesignCreateService({
	// 	userId: ownerId,
	// 	artworkVersionId,
	// 	type: 'stroke',
	// 	designTypeOverrides: {
	// 		basis: StrokeBasisTypeEnum.PALETTE_LOOP,
	// 	} as IStrokeCreateOverrides,
	// })

	// // just black stroke as alternate when viewing in editor
	// await artworkVersionDesignCreateService({
	// 	userId: ownerId,
	// 	artworkVersionId,
	// 	type: 'stroke',
	// })

	// await artworkVersionDesignCreateService({
	// 	userId: ownerId,
	// 	artworkVersionId,
	// 	type: 'line',
	// 	designTypeOverrides: {
	// 		width: 10,
	// 		basis: LineBasisTypeEnum.SIZE,
	// 		format: LineFormatTypeEnum.PERCENT,
	// 	} as ILineCreateOverrides,
	// })

	// // rotate all visible designs
	// // next two will be visible by default
	// await artworkVersionDesignCreateService({
	// 	userId: ownerId,
	// 	artworkVersionId,
	// 	type: 'rotate',
	// 	designTypeOverrides: {
	// 		basis: RotateBasisTypeEnum.VISIBLE_LOOP,
	// 	} as IRotateCreateOverrides,
	// })

	// // 45 degrees, 225 degrees
	// const rotateBases = [RotateBasisTypeEnum.NE, RotateBasisTypeEnum.SW]
	// async function processRotateBases() {
	// 	for (const basis of rotateBases) {
	// 		await artworkVersionDesignCreateService({
	// 			userId: ownerId,
	// 			artworkVersionId,
	// 			type: 'rotate',
	// 			designTypeOverrides: {
	// 				basis,
	// 			} as IRotateCreateOverrides,
	// 		})
	// 	}
	// }
	// processRotateBases().then(() => {
	// 	console.log('All rotate bases processed.')
	// })

	// // many triangles
	// await artworkVersionDesignCreateService({
	// 	userId: ownerId,
	// 	artworkVersionId,
	// 	type: 'layout',
	// 	designTypeOverrides: {
	// 		count: 10000,
	// 	} as ILayoutCreateOverrides,
	// })

	// // grid layout as alternate when viewing in editor
	// await artworkVersionDesignCreateService({
	// 	userId: ownerId,
	// 	artworkVersionId,
	// 	type: 'layout',
	// 	designTypeOverrides: {
	// 		style: LayoutStyleTypeEnum.GRID,
	// 		rows: 99,
	// 		columns: 11,
	// 	} as ILayoutCreateOverrides,
	// })

	// // template design is just triangle... for now
	// // this will become a very fun part of the project :D
	// await artworkVersionDesignCreateService({
	// 	userId: ownerId,
	// 	artworkVersionId,
	// 	type: 'template',
	// })

	console.timeEnd(`🎨 Created designs`)

	console.time(`📄 Created artwork`)
	// await artworkVersionLayerCreateService({
	// 	userId: ownerId,
	// 	artworkVersionId,
	// })
	console.timeEnd(`📄 Created artwork`)
}
