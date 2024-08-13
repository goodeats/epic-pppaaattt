import { type ZodType } from 'zod'
import { CloneArtworkVersionSchema } from '../artwork-version/_.clone.schema'
import { ArtworkBranchParentSchema } from './_._schema'
import { type IArtworkBranchArtworkVersionCloneData } from './artwork-version.clone.definitions'

export const CloneArtworkBranchArtworkVersionSchema =
	CloneArtworkVersionSchema.merge(
		ArtworkBranchParentSchema,
	) satisfies ZodType<IArtworkBranchArtworkVersionCloneData>
