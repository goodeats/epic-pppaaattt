import { type ZodType } from 'zod'
import { ArtworkBranchParentSchema } from './_._schema'
import { IArtworkBranchArtworkVersionCloneData } from './artwork-version.clone.definitions'
import { CloneArtworkVersionSchema } from '../artwork-version/_.clone.schema'

export const CloneArtworkBranchArtworkVersionSchema =
	CloneArtworkVersionSchema.merge(
		ArtworkBranchParentSchema,
	) satisfies ZodType<IArtworkBranchArtworkVersionCloneData>
