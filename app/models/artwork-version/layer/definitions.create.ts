import { ILayerSubmission } from '#app/models/layer/definitions'
import {
	ILayerCreateData,
	ILayerNewData,
} from '#app/models/layer/definitions.create'
import { IArtworkVersionParentData } from '../definitions'

export interface IArtworkVersionLayerNewData
	extends ILayerNewData,
		IArtworkVersionParentData {}

export interface IArtworkVersionLayerCreateSubmission
	extends IArtworkVersionLayerNewData,
		ILayerSubmission {
	cloneDesigns?: boolean
}

export interface IArtworkVersionLayerCreateData
	extends ILayerCreateData,
		IArtworkVersionParentData {}
