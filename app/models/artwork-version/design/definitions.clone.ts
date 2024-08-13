import { type IDesignParsed } from '#app/models/design/definitions'
import { type IUser } from '#app/models/user/user.server'
import { type IArtworkVersion } from '../definitions'

export interface IArtworkVersionDesignCloneSubmission {
	userId: IUser['id']
	artworkVersionId: IArtworkVersion['id']
	designs: IDesignParsed[]
}
