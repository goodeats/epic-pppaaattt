import {
	DesignParentTypeIdEnum,
	type NewDesignSchemaType,
} from '#app/schema/design'
import { NewArtboardVersionDesignSchema } from '#app/schema/design-artboard-version'
import { NewLayerDesignSchema } from '#app/schema/design-layer'
import {
	type entityParentIdTypeEnum,
	type NewEntitySchemaType,
} from '#app/schema/entity'
import { type NewLayerSchemaType } from '#app/schema/layer'
import { NewArtboardVersionLayerSchema } from '#app/schema/layer-artboard-version'
import { Routes, type RoutePath } from '#app/utils/routes.const'

export interface IDashboardPanelCreateEntityStrategy {
	route: RoutePath
	parentTypeId: entityParentIdTypeEnum
	formId: string
	schema: NewEntitySchemaType
	iconText: string
}

export class DashboardPanelCreateArtboardVersionDesignTypeStrategy
	implements IDashboardPanelCreateEntityStrategy
{
	route: RoutePath = Routes.RESOURCES.API.V1.ARTBOARD_VERSION.DESIGN.CREATE
	parentTypeId: entityParentIdTypeEnum =
		DesignParentTypeIdEnum.ARTBOARD_VERSION_ID
	formId: string = 'artboard-version-design-create'
	schema: NewDesignSchemaType = NewArtboardVersionDesignSchema
	iconText = 'Add New Design'
}

export class DashboardPanelCreateArtboardVersionLayerStrategy
	implements IDashboardPanelCreateEntityStrategy
{
	route: RoutePath = Routes.RESOURCES.API.V1.ARTBOARD_VERSION.LAYER.CREATE
	parentTypeId: entityParentIdTypeEnum =
		DesignParentTypeIdEnum.ARTBOARD_VERSION_ID
	formId: string = 'artboard-version-layer-create'
	schema: NewLayerSchemaType = NewArtboardVersionLayerSchema
	iconText = 'Add New Layer'
}

export class DashboardPanelCreateLayerDesignTypeStrategy
	implements IDashboardPanelCreateEntityStrategy
{
	route: RoutePath = Routes.RESOURCES.API.V1.LAYER.DESIGN.CREATE
	parentTypeId: entityParentIdTypeEnum = DesignParentTypeIdEnum.LAYER_ID
	formId: string = 'layer-design-create'
	schema: NewDesignSchemaType = NewLayerDesignSchema
	iconText = 'Add New Design'
}
