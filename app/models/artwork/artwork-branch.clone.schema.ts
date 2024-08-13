import { type ZodType } from 'zod'
import { ArtworkParentSchema } from '#app/schema/asset/image.artwork.js'
import { CloneArtworkBranchSchema } from '../artwork-branch/_.clone.schema'
import { type IArtworkArtworkBranchCloneData } from './artwork-branch.clone.definitions'

export const CloneArtworkArtworkBranchSchema = CloneArtworkBranchSchema.merge(
	ArtworkParentSchema,
) satisfies ZodType<IArtworkArtworkBranchCloneData>
