import { IDesignParsed } from '#app/models/design/definitions'
import { IUser } from '#app/models/user/user.server'
import { IArtworkVersion } from '../definitions'

export interface IArtworkVersionDesignCloneSubmission {
	userId: IUser['id']
	artworkVersionId: IArtworkVersion['id']
	designs: IDesignParsed[]
}
