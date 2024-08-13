import { IDesignParsed } from '#app/models/design/definitions'
import { ILayerWithChildren } from '#app/models/layer/definitions'
import { IUser } from '#app/models/user/user.server'
import { IArtworkVersion } from '../definitions'

export interface IArtworkVersionLayerCloneSubmission {
	userId: IUser['id']
	artworkVersionId: IArtworkVersion['id']
	layers: ILayerWithChildren[]
}
