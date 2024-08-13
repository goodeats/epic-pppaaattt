import { memo } from 'react'
import { type CreateChildEntityFormProps } from '#app/components/templates/panel/dashboard-entity-panel.header'
import { HiddenInputArtworkVersion } from '#app/components/ui/input-hidden'
import {
	EntityCreateIconForm,
	EntityCreateIconIntent,
} from '#app/routes/resources+/api.v1+/entity.create.icon'
import { generateParentFormId } from '#app/utils/form-id'
import { NewArtworkVersionLayerSchema } from './schema.create'

export const CreateArtworkVersionLayerForm = memo(
	({ entityType, type, parent }: CreateChildEntityFormProps) => {
		const parentId = parent.id
		const formId = generateParentFormId({
			action: 'create',
			parentType: 'artwork-version',
			parentId,
			entityType,
		})
		const intent = EntityCreateIconIntent.ARTWORK_VERSION.LAYER

		return (
			<EntityCreateIconForm
				formId={formId}
				intent={intent}
				schema={NewArtworkVersionLayerSchema}
				type="layer"
			>
				<div className="hidden">
					<HiddenInputArtworkVersion id={parentId} />
				</div>
			</EntityCreateIconForm>
		)
	},
)
CreateArtworkVersionLayerForm.displayName = 'CreateArtworkVersionLayerForm'
