import { type ZodType } from 'zod'
import { ArtworkBranchDataCreateSchema } from '#app/schema/artwork-branch.js'
import { ArtworkParentSchema } from '#app/schema/asset/image.artwork.js'
import { type IArtworkArtworkBranchCreateData } from './artwork-branch.create.definitions'

export const ArtworkArtworkBranchSchema: ZodType<IArtworkArtworkBranchCreateData> =
	ArtworkBranchDataCreateSchema.merge(
		ArtworkParentSchema,
	) satisfies ZodType<IArtworkArtworkBranchCreateData>
