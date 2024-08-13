import { z } from 'zod'
import { type IDesignDeleteData } from './definitions.delete'

export const DeleteDesignSchema = z.object({
	id: z.string(),
}) satisfies z.Schema<IDesignDeleteData>
