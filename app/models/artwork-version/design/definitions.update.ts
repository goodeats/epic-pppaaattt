import { type ILinkedListNodeUpdateOrderData } from '#app/models/__shared/linked-list.definitions.update'
import {
	type IDesignUpdateFieldData,
	type IDesignUpdateSubmission,
} from '#app/models/design/definitions.update'
import { type IArtworkVersionParentData } from '../definitions'

export interface IArtworkVersionDesignUpdateFieldData
	extends IDesignUpdateFieldData,
		IArtworkVersionParentData {}

export interface IArtworkVersionDesignUpdateFieldSubmission
	extends IArtworkVersionDesignUpdateFieldData,
		IDesignUpdateSubmission {}

export interface IArtworkVersionDesignUpdateOrderData
	extends IArtworkVersionDesignUpdateFieldData,
		ILinkedListNodeUpdateOrderData {}

export interface IArtworkVersionDesignUpdateOrderSubmission
	extends IArtworkVersionDesignUpdateOrderData,
		IDesignUpdateSubmission {}
