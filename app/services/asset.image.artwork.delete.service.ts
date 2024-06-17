import {
	deleteAssetImage,
	type IAssetImageDeletedResponse,
} from '#app/models/asset/image/image.delete.server'
import { type IAssetImage } from '#app/models/asset/image/image.server'
import { type IUser } from '#app/models/user/user.server'
import { prisma } from '#app/utils/db.server'

export const assetImageArtworkDeleteService = async ({
	userId,
	id,
}: {
	userId: IUser['id']
	id: IAssetImage['id']
}): Promise<IAssetImageDeletedResponse> => {
	try {
		// Step 1: delete the asset image via promise
		const deleteAssetImageArtworkPromise = deleteAssetImage({ id })

		// Step 2: execute the transaction
		await prisma.$transaction([deleteAssetImageArtworkPromise])

		return { success: true }
	} catch (error) {
		console.log(error)
		return {
			success: false,
			message: 'Unknown error: assetImageArtworkDeleteService',
		}
	}
}
