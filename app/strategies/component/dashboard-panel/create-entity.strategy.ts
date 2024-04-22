import { type NewDesignSchemaType } from '#app/schema/design'
import { NewArtboardVersionDesignSchema } from '#app/schema/design-artboard-version'
import { Routes, type RoutePath } from '#app/utils/routes.utils'

export interface IDashboardPanelCreateEntityStrategy {
	route: RoutePath
	parentTypeId: string
	formId: string
	schema: NewDesignSchemaType // could also be layer
	iconText: string
}

export class DashboardPanelCreateArtboardVersionDesignTypeStrategy
	implements IDashboardPanelCreateEntityStrategy
{
	route: RoutePath = Routes.RESOURCES.API.V1.ARTBOARD_VERSION.DESIGN.CREATE
	parentTypeId: string = 'artboardVersionId'
	formId: string = 'artboard-version-design-create'
	schema: NewDesignSchemaType = NewArtboardVersionDesignSchema
	iconText = 'Add New Design'
}
