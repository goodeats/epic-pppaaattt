import { z } from 'zod'
import { type ILayerNewData } from './definitions.create'

export const NewLayerSchema = z.object({}) satisfies z.Schema<ILayerNewData>
