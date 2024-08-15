import { type IDesignSubmission } from '#app/models/design/definitions'
import { type IDesignDeleteData } from '#app/models/design/definitions.delete'
import { type ILayerParentData } from './definitions'

export interface ILayerDesignDeleteData
	extends IDesignDeleteData,
		ILayerParentData {}

export interface ILayerDesignDeleteSubmission
	extends ILayerDesignDeleteData,
		IDesignSubmission {}
