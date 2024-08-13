import { memo } from 'react'
import { type IArtworkVersion } from '#app/models/artwork-version/definitions'
import { AssetImageArtworkVersionCreate } from '#app/routes/resources+/api.v1+/asset.image.artwork-version.create'
import { designTypeEnum } from '#app/models/design/definitions'
import { EntityType } from '#app/schema/entity'
import { CreateChildEntityFormProps } from '#app/components/templates/panel/dashboard-entity-panel.header'
import { CreateArtworkVersionDesignForm } from '../design/__components.panel.create'
import { CreateArtworkVersionLayerForm } from '../layer/__components.panel.create'

export const ArtworkVersionCreateChildEntityForm = memo(
	({ entityType, type, parent }: CreateChildEntityFormProps) => {
		switch (entityType) {
			case EntityType.ASSET:
				return (
					<AssetImageArtworkVersionCreate version={parent as IArtworkVersion} />
				)
			case EntityType.DESIGN:
				return (
					<CreateArtworkVersionDesignForm
						entityType={entityType}
						type={type as designTypeEnum}
						parent={parent}
					/>
				)
			case EntityType.LAYER:
				return (
					<CreateArtworkVersionLayerForm
						entityType={entityType}
						type={type as designTypeEnum}
						parent={parent}
					/>
				)
			default:
				console.log('unknown artwork version entity type', entityType)
				return null
		}
	},
)
ArtworkVersionCreateChildEntityForm.displayName =
	'ArtworkVersionCreateChildEntityForm'
