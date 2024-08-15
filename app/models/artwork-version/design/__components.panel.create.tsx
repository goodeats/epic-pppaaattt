import { memo } from 'react'
import { type CreateChildEntityFormProps } from '#app/components/templates/panel/dashboard-entity-panel.header'
import {
	HiddenInputArtworkVersion,
	HiddenInputDesignType,
} from '#app/components/ui/input-hidden'
import { type designTypeEnum } from '#app/models/design/definitions'
import {
	EntityCreateIconForm,
	EntityCreateIconIntent,
} from '#app/routes/resources+/api.v1+/entity.create.icon'
import { generateParentFormId } from '#app/utils/form-id'
import { NewArtworkVersionDesignSchema } from './schema.create'

export const CreateArtworkVersionDesignForm = memo(
	({ entityType, type, parent }: CreateChildEntityFormProps) => {
		const designType = type as designTypeEnum
		const parentId = parent.id
		const formId = generateParentFormId({
			action: 'create',
			parentType: 'artwork-version',
			parentId,
			entityType,
		})
		const intent = EntityCreateIconIntent.ARTWORK_VERSION.DESIGN

		return (
			<EntityCreateIconForm
				formId={formId}
				intent={intent}
				schema={NewArtworkVersionDesignSchema}
				type={designType}
			>
				<div className="hidden">
					<HiddenInputArtworkVersion id={parentId} />
					<HiddenInputDesignType type={designType} />
				</div>
			</EntityCreateIconForm>
		)
	},
)
CreateArtworkVersionDesignForm.displayName = 'CreateArtworkVersionDesignForm'
