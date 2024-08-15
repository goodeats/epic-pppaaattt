import { type IDesignSubmission } from '#app/models/design/definitions'
import { type IDesignCloneData } from '#app/models/design/definitions.clone'
import { type IDesignNewData } from '#app/models/design/definitions.create'
import { type IDesignFillCreateData } from '#app/models/design/fill/definitions.create'
import { type IArtworkVersionParentData } from '../definitions'

export interface IArtworkVersionDesignNewData
	extends IDesignNewData,
		IArtworkVersionParentData {}

export interface IArtworkVersionDesignCreateSubmission
	extends IArtworkVersionDesignNewData,
		IDesignSubmission {
	data?: IDesignCloneData
}

export interface IArtworkVersionDesignFillCreateData
	extends IDesignFillCreateData,
		IArtworkVersionParentData {}

export type IArtworkVersionDesignCreateData =
	IArtworkVersionDesignFillCreateData
