import {
	type IArtworkVersionCreateData,
	type IArtworkVersionNewData,
} from '../artwork-version/definitions.create'
import { type IArtworkBranchParentData } from './_._definitions'

export interface IArtworkBranchArtworkVersionNewData
	extends IArtworkVersionNewData,
		IArtworkBranchParentData {}

export interface IArtworkBranchArtworkVersionCreateData
	extends IArtworkVersionCreateData,
		IArtworkBranchParentData {}
