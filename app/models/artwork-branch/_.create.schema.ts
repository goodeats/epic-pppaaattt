import { z } from 'zod'
import { type IArtworkBranchNewData } from './_.create.definitions'

export const NewArtworkBranchSchema = z.object(
	{},
) satisfies z.Schema<IArtworkBranchNewData>
