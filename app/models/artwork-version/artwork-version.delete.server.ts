import { prisma } from '#app/utils/db.server'
import { type IArtworkVersion } from './definitions'

export interface IArtworkVersionDeletedResponse {
	success: boolean
	message?: string
}

export const deleteArtworkVersions = ({
	ids,
}: {
	ids: IArtworkVersion['id'][]
}) => {
	return prisma.artworkVersion.deleteMany({
		where: {
			id: {
				in: ids,
			},
		},
	})
}
