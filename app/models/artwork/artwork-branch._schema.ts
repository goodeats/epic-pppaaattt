import { type ZodType } from 'zod'
import { ArtworkBranchParentSchema } from '../artwork-branch/_._schema'
import { ArtworkVersionDataSchema } from '../artwork-version/schema'
import { type IArtworkArtworkBranchCreateData } from './artwork-version.create.definitions'

export const ArtworkArtworkBranchSchema: ZodType<IArtworkArtworkBranchCreateData> =
	ArtworkVersionDataSchema.merge(
		ArtworkBranchParentSchema,
	) satisfies ZodType<IArtworkArtworkBranchCreateData>
