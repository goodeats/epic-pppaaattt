import { z } from 'zod'
import { IDesignDeleteData } from './definitions.delete'

export const DeleteDesignSchema = z.object({
	id: z.string(),
}) satisfies z.Schema<IDesignDeleteData>
