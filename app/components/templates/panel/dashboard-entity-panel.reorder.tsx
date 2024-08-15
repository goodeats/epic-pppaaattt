import { memo, useCallback } from 'react'
import { UpdateArtworkVersionReorderDesignForm } from '#app/models/artwork-version/design/__components.panel.reorder'
import { UpdateArtworkVersionReorderLayerForm } from '#app/models/artwork-version/layer/__components.panel.reorder'
import { UpdateLayerReorderDesignForm } from '#app/models/layer/design.__components.panel.reorder'
import {
	EntityParentType,
	type entityParentTypeEnum,
	EntityType,
	type entityTypeEnum,
	type IEntity,
	type IEntityParentType,
} from '#app/schema/entity'
import { type IDashboardPanelUpdateEntityOrderStrategy } from '#app/strategies/component/dashboard-panel/update-entity-order.strategy'
import { SidebarPanelRowReorderContainer } from '..'

export interface ReorderChildEntityFormProps {
	entityType: entityTypeEnum
	parentType?: entityParentTypeEnum
	entity: IEntity
	parent: IEntityParentType
	atTop: boolean
	atBottom: boolean
}

const ArtworkVersionReorderChildEntityForm = memo(
	({
		entityType,
		entity,
		parent,
		atTop,
		atBottom,
	}: ReorderChildEntityFormProps) => {
		switch (entityType) {
			case EntityType.DESIGN:
				return (
					<UpdateArtworkVersionReorderDesignForm
						entityType={entityType}
						entity={entity}
						parent={parent}
						atTop={atTop}
						atBottom={atBottom}
					/>
				)
			case EntityType.LAYER:
				return (
					<UpdateArtworkVersionReorderLayerForm
						entityType={entityType}
						entity={entity}
						parent={parent}
						atTop={atTop}
						atBottom={atBottom}
					/>
				)
			default:
				console.log('unknown artwork version entity type', entityType)
				return null
		}
	},
)
ArtworkVersionReorderChildEntityForm.displayName =
	'ArtworkVersionReorderChildEntityForm'

const LayerReorderChildEntityForm = memo(
	({
		entityType,
		entity,
		parent,
		atTop,
		atBottom,
	}: ReorderChildEntityFormProps) => {
		switch (entityType) {
			case EntityType.DESIGN:
				return (
					<UpdateLayerReorderDesignForm
						entityType={entityType}
						entity={entity}
						parent={parent}
						atTop={atTop}
						atBottom={atBottom}
					/>
				)
			default:
				console.log('unknown layer entity type', entityType)
				return null
		}
	},
)
LayerReorderChildEntityForm.displayName = 'LayerReorderChildEntityForm'

const ReorderEntityForm = memo(
	({
		parentType,
		entityType,
		entity,
		parent,
		atTop,
		atBottom,
	}: ReorderChildEntityFormProps) => {
		switch (parentType) {
			case EntityParentType.ARTWORK_VERSION:
				return (
					<ArtworkVersionReorderChildEntityForm
						entityType={entityType}
						entity={entity}
						parent={parent}
						atTop={atTop}
						atBottom={atBottom}
					/>
				)
			case EntityParentType.LAYER:
				return (
					<LayerReorderChildEntityForm
						entityType={entityType}
						entity={entity}
						parent={parent}
						atTop={atTop}
						atBottom={atBottom}
					/>
				)
			default:
				console.log('unknown parent type', parentType)
				return null
		}
	},
)
ReorderEntityForm.displayName = 'ReorderEntityForm'

export const PanelEntityRowReorder = ({
	entity,
	parent,
	atTop,
	atBottom,
	strategyReorder,
}: {
	entity: IEntity
	parent: IEntityParentType
	atTop: boolean
	atBottom: boolean
	strategyReorder: IDashboardPanelUpdateEntityOrderStrategy
}) => {
	const { entityType, parentType } = strategyReorder

	const reorderEntityForm = useCallback(
		() => (
			<ReorderEntityForm
				parentType={parentType}
				entityType={entityType}
				entity={entity}
				parent={parent}
				atTop={atTop}
				atBottom={atBottom}
			/>
		),
		[parentType, entityType, entity, parent, atTop, atBottom],
	)

	return (
		<SidebarPanelRowReorderContainer>
			{reorderEntityForm()}
		</SidebarPanelRowReorderContainer>
	)
}
