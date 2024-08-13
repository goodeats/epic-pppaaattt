import { IDesignParsed } from '#app/models/design/definitions'
import { type ILayerWithChildren } from '#app/models/layer/definitions'
import { type IUser } from '#app/models/user/user.server'
import { type IArtworkVersion } from '../definitions'

export interface IArtworkVersionLayerCloneSubmission {
	userId: IUser['id']
	artworkVersionId: IArtworkVersion['id']
	layers: ILayerWithChildren[]
}
