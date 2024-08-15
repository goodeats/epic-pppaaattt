import { type IUser } from '#app/models/user/user.server'
import { type IArtworkVersionWithChildren } from '../artwork-version/definitions'
import { type IArtworkBranch } from './_._definitions'

export interface IArtworkBranchArtworkVersionsCloneSubmission {
	userId: IUser['id']
	artworkBranchId: IArtworkBranch['id']
	artworkVersions: IArtworkVersionWithChildren[]
}
