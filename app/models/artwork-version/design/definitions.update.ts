import { ILinkedListNodeUpdateOrderData } from '#app/models/__shared/linked-list.definitions.update'
import {
	IDesignUpdateFieldData,
	IDesignUpdateSubmission,
} from '#app/models/design/definitions.update'
import { IArtworkVersionParentData } from '../definitions'

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
