import { type ZodType } from 'zod'
import { ArtworkVersionDataSchema } from '../artwork-version/schema'
import { ArtworkBranchParentSchema } from './_._schema'
import { type IArtworkBranchArtworkVersionCreateData } from './artwork-version.create.definitions'

export const ArtworkBranchArtworkVersionSchema: ZodType<IArtworkBranchArtworkVersionCreateData> =
	ArtworkVersionDataSchema.merge(
		ArtworkBranchParentSchema,
	) satisfies ZodType<IArtworkBranchArtworkVersionCreateData>
