import { type IDesignSubmission } from '#app/models/design/definitions'
import { IDesignDeleteData } from '#app/models/design/definitions.delete'
import { ILayerParentData } from './definitions'

export interface ILayerDesignDeleteData
	extends IDesignDeleteData,
		ILayerParentData {}

export interface ILayerDesignDeleteSubmission
	extends ILayerDesignDeleteData,
		IDesignSubmission {}
