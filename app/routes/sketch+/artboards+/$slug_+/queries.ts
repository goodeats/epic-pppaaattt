import { type IFill } from '#app/models/fill.server'
import { type ILayout } from '#app/models/layout.server'
import { type ILine } from '#app/models/line.server'
import { type IPalette } from '#app/models/palette.server'
import { type IRotate } from '#app/models/rotate.server'
import { type ISize } from '#app/models/size.server'
import { type IStroke } from '#app/models/stroke.server'
import { type ITemplate } from '#app/models/template.server'
import { prisma } from '#app/utils/db.server'
import { artboardBuildCreateService } from './services/artboard/build/create.service'

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

export type PickedArtboardType = {
	id: string
	name: string
	description: string | null
	slug: string
	width: number
	height: number
	backgroundColor: string
	selectedDesigns: string
	updatedAt: Date | string
	project: {
		id: string
		name: string
		slug: string
	}
}

export const getArtboard = async (
	userId: string,
	slug: string,
): Promise<PickedArtboardType | null> => {
	return await prisma.artboard.findFirst({
		where: { slug: slug, ownerId: userId },
		select: {
			id: true,
			name: true,
			description: true,
			slug: true,
			width: true,
			height: true,
			backgroundColor: true,
			selectedDesigns: true,
			updatedAt: true,
			project: {
				select: {
					id: true,
					name: true,
					slug: true,
				},
			},
		},
	})
}

// this could be its own model potentially
// i.e., artboard has many builds
export interface IArtboardBuild {
	id: string
	layers: IArtboardLayerBuild[]
}

export interface IArtboardLayerBuild {
	palette: IPalette
	size: ISize
	fill: IFill
	stroke: IStroke
	line: ILine
	rotate: IRotate
	layout: ILayout
	template: ITemplate
	// create this type
	container: IArtboardLayerContainerBuild
}

export interface IArtboardLayerContainerBuild {
	width: number
	height: number
	top: number
	left: number
	margin: number
}

export const getArtboardBuild = async (
	artboard: PickedArtboardType,
): Promise<IArtboardBuild | null> => {
	const artboardBuild = await artboardBuildCreateService({ artboard })
	console.log('artboardBuild', artboardBuild)
	return artboardBuild
}
