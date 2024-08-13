import { z } from 'zod'
import { DesignTypeEnum } from '#app/models/design/definitions'
import { type IDesignNewData } from './definitions.create'

export const NewDesignSchema = z.object({
	type: z.nativeEnum(DesignTypeEnum),
}) satisfies z.Schema<IDesignNewData>
