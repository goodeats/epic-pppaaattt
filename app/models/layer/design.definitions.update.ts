import {
	IDesignUpdateFieldData,
	IDesignUpdateSubmission,
} from '#app/models/design/definitions.update'
import { ILinkedListNodeUpdateOrderData } from '../__shared/linked-list.definitions.update'
import { ILayerParentData } from './definitions'

export interface ILayerDesignUpdateFieldData
	extends IDesignUpdateFieldData,
		ILayerParentData {}

export interface ILayerDesignUpdateFieldSubmission
	extends ILayerDesignUpdateFieldData,
		IDesignUpdateSubmission {}

export interface ILayerDesignUpdateOrderData
	extends ILayerDesignUpdateFieldData,
		ILinkedListNodeUpdateOrderData {}

export interface ILayerDesignUpdateOrderSubmission
	extends ILayerDesignUpdateOrderData,
		IDesignUpdateSubmission {}
