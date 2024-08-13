import { z } from 'zod'
import { ILayerNewData } from './definitions.create'

export const NewLayerSchema = z.object({}) satisfies z.Schema<ILayerNewData>
