import { type Layer } from '@prisma/client'
import { type DateOrString } from '#app/definitions/prisma-helper'
import { type IAssetParsed } from '../asset/asset.server'
import { type IDesignParsed, type IDesignWithType } from '../design/definitions'
import { type IUser } from '../user/user.server'
import { ISubmission } from '#app/definitions/submission.js'
import { IArtworkVersion } from '../artwork-version/definitions'

// Omitting 'createdAt' and 'updatedAt' from the Layer interface
// prisma query returns a string for these fields
type BaseLayer = Omit<Layer, 'createdAt' | 'updatedAt'>

export interface ILayer extends BaseLayer {
	createdAt: DateOrString
	updatedAt: DateOrString
}

export type ILayerEntityId = IArtworkVersion['id']
export interface ILayerWithDesigns extends ILayer {
	designs: IDesignWithType[]
}

export interface ILayerWithChildren extends ILayer {
	assets: IAssetParsed[]
	designs: IDesignParsed[]
}

export interface ILayerCreateOverrides {
	name?: string
	description?: string
	slug?: string
	visible?: boolean
}

export interface ILayerData {
	name: string
	description?: string | null
	slug?: string | null
	visible: boolean
	selected: boolean
}

export interface ILayerSubmission extends ILayerData, ISubmission {}

export interface ILayerParentData {
	layerId: ILayer['id']
}
