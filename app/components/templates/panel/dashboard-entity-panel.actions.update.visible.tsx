import { memo, useCallback } from 'react'
import { type IArtworkVersion } from '#app/models/artwork-version/definitions'
import { ToggleArtworkVersionDesignVisibleForm } from '#app/models/artwork-version/design/__components.panel.visible'
import { ToggleArtworkVersionLayerVisibleForm } from '#app/models/artwork-version/layer/__components.panel.visible'
import { type IAssetImage } from '#app/models/asset/image/image.server'
import { type ILayer } from '#app/models/layer/definitions'
import { ToggleLayerDesignVisibleForm } from '#app/models/layer/design.__components.panel.visible'
import { AssetImageArtworkVersionUpdateVisible } from '#app/routes/resources+/api.v1+/asset.image.artwork-version.update.visible'
import { AssetImageLayerUpdateVisible } from '#app/routes/resources+/api.v1+/asset.image.layer.update.visible'
import {
	type entityParentTypeEnum,
	type entityTypeEnum,
	type IEntityParentType,
	type IEntityVisible,
	EntityType,
	EntityParentType,
} from '#app/schema/entity'
import { type IDashboardPanelUpdateEntityVisibleStrategy } from '#app/strategies/component/dashboard-panel/update-entity-visible.strategy'

export interface ToggleVisibleChildEntityFormProps {
	entityType: entityTypeEnum
	parentType?: entityParentTypeEnum
	entity: IEntityVisible
	parent: IEntityParentType
}

const ArtworkVersionToggleVisibleChildEntityForm = memo(
	({ entityType, entity, parent }: ToggleVisibleChildEntityFormProps) => {
		switch (entityType) {
			case EntityType.ASSET:
				return (
					<AssetImageArtworkVersionUpdateVisible
						image={entity as IAssetImage}
						artworkVersion={parent as IArtworkVersion}
					/>
				)
			case EntityType.DESIGN:
				return (
					<ToggleArtworkVersionDesignVisibleForm
						entityType={entityType}
						entity={entity}
						parent={parent}
					/>
				)
			case EntityType.LAYER:
				return (
					<ToggleArtworkVersionLayerVisibleForm
						entityType={entityType}
						entity={entity}
						parent={parent}
					/>
				)
			default:
				console.log('unknown artwork version entity type', entityType)
				return null
		}
	},
)
ArtworkVersionToggleVisibleChildEntityForm.displayName =
	'ArtworkVersionToggleVisibleChildEntityForm'

const LayerToggleVisibleChildEntityForm = memo(
	({ entityType, entity, parent }: ToggleVisibleChildEntityFormProps) => {
		switch (entityType) {
			case EntityType.ASSET:
				return (
					<AssetImageLayerUpdateVisible
						image={entity as IAssetImage}
						layer={parent as ILayer}
					/>
				)
			case EntityType.DESIGN:
				return (
					<ToggleLayerDesignVisibleForm
						entityType={entityType}
						entity={entity}
						parent={parent}
					/>
				)
			default:
				console.log('unknown layer entity type', entityType)
				return null
		}
	},
)
LayerToggleVisibleChildEntityForm.displayName =
	'LayerToggleVisibleChildEntityForm'

const ToggleVisibleEntityForm = memo(
	({
		parentType,
		entityType,
		entity,
		parent,
	}: ToggleVisibleChildEntityFormProps) => {
		switch (parentType) {
			case EntityParentType.ARTWORK_VERSION:
				return (
					<ArtworkVersionToggleVisibleChildEntityForm
						entityType={entityType}
						entity={entity}
						parent={parent}
					/>
				)
			case EntityParentType.LAYER:
				return (
					<LayerToggleVisibleChildEntityForm
						entityType={entityType}
						entity={entity}
						parent={parent}
					/>
				)
			default:
				console.log('unknown parent type', parentType)
				return null
		}
	},
)
ToggleVisibleEntityForm.displayName = 'ToggleVisibleEntityForm'

export const PanelEntityToggleVisobleAction = ({
	entity,
	parent,
	strategyToggleVisible,
}: {
	entity: IEntityVisible
	parent: IEntityParentType
	strategyToggleVisible: IDashboardPanelUpdateEntityVisibleStrategy
}) => {
	const { entityType, parentType } = strategyToggleVisible

	const toggleVisibleEntityForm = useCallback(
		() => (
			<ToggleVisibleEntityForm
				parentType={parentType}
				entityType={entityType}
				entity={entity}
				parent={parent}
			/>
		),
		[parentType, entityType, entity, parent],
	)

	// return 'TV'
	return toggleVisibleEntityForm()
}
