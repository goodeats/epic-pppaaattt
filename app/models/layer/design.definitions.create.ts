import { type IDesignSubmission } from '#app/models/design/definitions'
import { type IDesignNewData } from '#app/models/design/definitions.create'
import { type IDesignFillCreateData } from '#app/models/design/fill/definitions.create'
import { type ILayerParentData } from './definitions'

export interface ILayerDesignNewData extends IDesignNewData, ILayerParentData {}

export interface ILayerDesignCreateSubmission
	extends ILayerDesignNewData,
		IDesignSubmission {}

export interface ILayerDesignFillCreateData
	extends IDesignFillCreateData,
		ILayerParentData {}

export type ILayerDesignCreateData = ILayerDesignFillCreateData
