type ParentActionType = 'create' | 'clone' | 'move-up' | 'move-down'
type EntityActionType = 'update' | 'delete'

type ParentType = 'example-parent' | 'artwork' | 'artwork-branch' | 'artwork-version' | 'layer'
type EntityAssetType = 'asset' | 'asset-type-image'
type EntityDesignType = 'design' | 'design-type-fill'
type EntityType = ParentType | EntityAssetType | EntityDesignType | 'example-child'

type FieldTypeDesign = 'visible'
type FieldTypeDesignFill = 'basis' | 'style' | 'value'
type FieldType = FieldTypeDesign | FieldTypeDesignFill

// string is aka id
type ParentFormId = `${ParentType}-${string}-${ParentActionType}-${EntityType}`
type ParentReorderFormId =
	`${ParentType}-${string}-${ParentActionType}-${EntityType}-${FieldType}-${string}`
type EntityFormId = `${EntityType}-${string}-${EntityActionType}-${FieldType}`

type ParentFormIdParams = {
	action: ParentActionType
	parentType: ParentType
	parentId: string
	entityType: EntityType
	suffix?: string
}

type ParentReorderFormIdParams = {
	action: ParentActionType
	parentType: ParentType
	parentId: string
	entityType: EntityType
	entityId: string
	suffix?: string
}

type EntityFormIdParams = {
	action: EntityActionType
	entityType: EntityType
	entityId: string
	field?: FieldType
	suffix?: string
}

export const generateParentFormId = ({
	action,
	parentType,
	parentId,
	entityType,
	suffix,
}: ParentFormIdParams): ParentFormId => {
	const id = `${parentType}-${parentId}-${entityType}-${action}`
	return suffix ? (`${id}-${suffix}` as ParentFormId) : (id as ParentFormId)
}

export const generateParentReorderFormId = ({
	action,
	parentType,
	parentId,
	entityType,
	entityId,
	suffix,
}: ParentReorderFormIdParams): ParentReorderFormId => {
	const id = `${parentType}-${parentId}-${entityType}-${entityId}-${action}`
	return suffix
		? (`${id}-${suffix}` as ParentReorderFormId)
		: (id as ParentReorderFormId)
}

export const generateEntityFormId = ({
	entityType,
	entityId,
	action,
	field,
	suffix,
}: EntityFormIdParams): EntityFormId => {
	const baseId = `${entityType}-${entityId}-${action}`
	const fieldPart = field ? `-${field}` : ''
	const suffixPart = suffix ? `-${suffix}` : ''
	return `${baseId}${fieldPart}${suffixPart}` as EntityFormId
}
