import {
	type IArtworkBranchCreateData,
	type IArtworkBranchNewData,
} from '../artwork-branch/_.create.definitions'
import { type IArtworkParentData } from './_._definiitions'

export interface IArtworkArtworkBranchNewData
	extends IArtworkBranchNewData,
		IArtworkParentData {}

export interface IArtworkArtworkBranchCreateData
	extends IArtworkBranchCreateData,
		IArtworkParentData {}
