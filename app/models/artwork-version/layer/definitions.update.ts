import { type ILinkedListNodeUpdateOrderData } from '#app/models/__shared/linked-list.definitions.update'
import {
	type ILayerUpdateFieldData,
	type ILayerUpdateSubmission,
} from '#app/models/layer/definitions.update'
import { type IArtworkVersionParentData } from '../definitions'

export interface IArtworkVersionLayerUpdateFieldData
	extends ILayerUpdateFieldData,
		IArtworkVersionParentData {}

export interface IArtworkVersionLayerUpdateFieldSubmission
	extends IArtworkVersionLayerUpdateFieldData,
		ILayerUpdateSubmission {}

export interface IArtworkVersionLayerUpdateOrderData
	extends IArtworkVersionLayerUpdateFieldData,
		ILinkedListNodeUpdateOrderData {}

export interface IArtworkVersionLayerUpdateOrderSubmission
	extends IArtworkVersionLayerUpdateOrderData,
		ILayerUpdateSubmission {}
