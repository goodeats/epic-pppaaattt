import { type IArtwork } from '#app/models/artwork/artwork.server'
import { type IArtworkBranch } from '#app/models/artwork-branch/_._definitions.js'
import { type IArtworkVersion } from '#app/models/artwork-version/definitions'
import {
	type IAssetParent,
	type IAssetType,
} from '#app/models/asset/asset.server'
import {
	type IDesignWithType,
	type IDesign,
	type IDesignType,
	type IDesignParent,
	type IDesignParsed,
	type designTypeEnum,
} from '#app/models/design/definitions'
import { type IDesignFill } from '#app/models/design/fill/definitions'
import { type IDesignLayout } from '#app/models/design/layout/layout.server'
import { type IDesignLine } from '#app/models/design/line/line.server'
import { type IDesignPalette } from '#app/models/design/palette/palette.server'
import { type IDesignRotate } from '#app/models/design/rotate/rotate.server'
import { type IDesignSize } from '#app/models/design/size/size.server'
import { type IDesignStroke } from '#app/models/design/stroke/stroke.server'
import { type IDesignTemplate } from '#app/models/design/template/template.server'
import { type IFill } from '#app/models/design-type/fill/fill.server'
import { type ILayout } from '#app/models/design-type/layout/layout.server'
import { type ILine } from '#app/models/design-type/line/line.server'
import { type IPalette } from '#app/models/design-type/palette/palette.server'
import { type IRotate } from '#app/models/design-type/rotate/rotate.server'
import { type ISize } from '#app/models/design-type/size/size.server'
import { type IStroke } from '#app/models/design-type/stroke/stroke.server'
import { type ITemplate } from '#app/models/design-type/template/template.server'
import { type ILayer } from '#app/models/layer/definitions'
import { type IProject } from '#app/models/project/project.server'
import { type ObjectValues } from '#app/utils/typescript-helpers'
import { type assetTypeEnum } from './asset'
import {
	type ToggleVisibleDesignSchemaType,
	type DeleteDesignSchemaType,
	type DesignParentType,
} from './design'
import {
	type ToggleVisibleLayerSchemaType,
	type DeleteLayerSchemaType,
	type SelectLayerSchemaType,
} from './layer'

export type IEntity =
	| ILayer
	| IDesign
	| IDesignWithType
	| IArtworkVersion
	| IPalette
	| ISize
	| IFill
	| IStroke
	| ILine
	| IRotate
	| ILayout
	| ITemplate
	| IAssetType
	| IDesignParsed
	| IDesignType
	| IDesignFill
	| IDesignLayout
	| IDesignLine
	| IDesignPalette
	| IDesignRotate
	| IDesignSize
	| IDesignStroke
	| IDesignTemplate

export type IEntityVisible =
	| IDesign
	| IDesignParsed
	| IDesignWithType
	| ILayer
	| IAssetType
	| IDesignType
export type IEntitySelectable = ILayer
export type IEntityWithSlug =
	| IArtwork
	| IArtworkBranch
	| IArtworkVersion
	| IProject

export type IEntityId =
	| ILayer['id']
	| IDesign['id']
	| IDesignWithType['id']
	| IArtworkVersion['id']
	| IPalette['id']
	| ISize['id']
	| IFill['id']
	| IStroke['id']
	| ILine['id']
	| IRotate['id']
	| ILayout['id']
	| ITemplate['id']

export type IEntityType = designTypeEnum | assetTypeEnum | 'layer'

export type IEntityParentType =
	| IAssetParent
	| IDesignParent
	| IDesignWithType
	| IArtworkVersion
	| DesignParentType

export type IEntityParentId = IDesignWithType['id'] | IArtworkVersion['id']

export const EntityType = {
	ASSET: 'asset',
	DESIGN: 'design',
	LAYER: 'layer',
	// add more parent id types here
} as const
export type entityTypeEnum = ObjectValues<typeof EntityType>

export const EntityParentType = {
	DESIGN: 'design',
	ARTWORK_VERSION: 'artworkVersion',
	LAYER: 'layer',
	// add more parent types here
} as const
export type entityParentTypeEnum = ObjectValues<typeof EntityParentType>

export const EntityParentIdType = {
	DESIGN_ID: 'designId',
	ARTWORK_VERSION_ID: 'artworkVersionId',
	LAYER_ID: 'layerId',
	// add more parent id types here
} as const
export type entityParentIdTypeEnum = ObjectValues<typeof EntityParentIdType>

// actions that go at end of the panel
export const EntityActionType = {
	DELETE: 'delete',
	TOGGLE_VISIBLE: 'toggle-visible',
	SELECT: 'select',
	// add more action types here
} as const
export type entityActionTypeEnum = ObjectValues<typeof EntityActionType>

export type EntityActionType =
	| ToggleVisibleEntitySchemaType
	| DeleteEntitySchemaType

export type ToggleVisibleEntitySchemaType =
	| ToggleVisibleDesignSchemaType
	| ToggleVisibleLayerSchemaType

export type DeleteEntitySchemaType =
	| DeleteDesignSchemaType
	| DeleteLayerSchemaType

export type SelectEntitySchemaType = SelectLayerSchemaType
