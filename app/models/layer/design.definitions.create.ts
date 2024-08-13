import { IDesignSubmission } from '#app/models/design/definitions'
import { IDesignNewData } from '#app/models/design/definitions.create'
import { IDesignFillCreateData } from '#app/models/design/fill/definitions.create'
import { ILayerParentData } from './definitions'

export interface ILayerDesignNewData extends IDesignNewData, ILayerParentData {}

export interface ILayerDesignCreateSubmission
	extends ILayerDesignNewData,
		IDesignSubmission {}

export interface ILayerDesignFillCreateData
	extends IDesignFillCreateData,
		ILayerParentData {}

export type ILayerDesignCreateData = ILayerDesignFillCreateData
