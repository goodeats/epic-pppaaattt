import { type IDesignSubmission } from '#app/models/design/definitions'
import { IDesignDeleteData } from '#app/models/design/definitions.delete'
import { type IArtworkVersionParentData } from '../definitions'

export interface IArtworkVersionDesignDeleteData
	extends IDesignDeleteData,
		IArtworkVersionParentData {}

export interface IArtworkVersionDesignDeleteSubmission
	extends IArtworkVersionDesignDeleteData,
		IDesignSubmission {}
