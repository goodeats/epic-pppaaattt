import { memo } from 'react'
import { type CreateChildEntityFormProps } from '#app/components/templates/panel/dashboard-entity-panel.header'
import { AssetImageLayerCreate } from '#app/routes/resources+/api.v1+/asset.image.layer.create'
import { EntityType } from '#app/schema/entity'
import { type ILayer } from './definitions'
import { CreateLayerDesignForm } from './design.__components.panel.create'

export const LayerCreateChildEntityForm = memo(
	({ entityType, type, parent }: CreateChildEntityFormProps) => {
		switch (entityType) {
			case EntityType.ASSET:
				return <AssetImageLayerCreate layer={parent as ILayer} />
			case EntityType.DESIGN:
				return (
					<CreateLayerDesignForm
						entityType={entityType}
						type={type}
						parent={parent}
					/>
				)
			default:
				console.log('unknown layer entity type', entityType)
				return null
		}
	},
)
LayerCreateChildEntityForm.displayName = 'LayerCreateChildEntityForm'
