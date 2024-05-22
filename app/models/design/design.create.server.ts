import { type User } from '@prisma/client'
import { type designTypeEnum } from '#app/schema/design'
import { NewArtworkVersionDesignSchema } from '#app/schema/design-artwork-version'
import { prisma } from '#app/utils/db.server'
import { type IArtwork } from '../artwork/artwork.server'
import { type IArtworkVersion } from '../artwork-version/artwork-version.server'
import { type IDesign } from '../design/design.server'
import { type ILayer } from '../layer/layer.server'

export interface IDesignCreatedResponse {
	success: boolean
	message?: string
	createdDesign?: IDesign
}

export const createDesign = async ({
	data,
}: {
	data: {
		ownerId: User['id']
		type: designTypeEnum
		artworkId?: IArtwork['id']
		artworkVersionId?: IArtworkVersion['id']
		layerId?: ILayer['id']
		visible?: boolean
		selected?: boolean
	}
}): Promise<IDesign | null> => {
	const createdDesign = await prisma.design.create({ data })
	return createdDesign
}

export const createArtworkVersionDesign = async ({
	data,
}: {
	data: {
		ownerId: User['id']
		type: designTypeEnum
		artworkVersionId: IArtworkVersion['id']
		visible?: boolean
		selected?: boolean
	}
}): Promise<IDesign | null> => {
	const { ownerId } = data
	const parsedData = NewArtworkVersionDesignSchema.parse(data)
	const createdDesign = await createDesign({ data: { ownerId, ...parsedData } })
	return createdDesign
}
