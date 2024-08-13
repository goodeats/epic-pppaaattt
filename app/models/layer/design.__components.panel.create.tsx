import { generateParentFormId } from '#app/utils/form-id'
import { memo } from 'react'
import {
	HiddenInputDesignType,
	HiddenInputLayer,
} from '#app/components/ui/input-hidden'
import { CreateChildEntityFormProps } from '#app/components/templates/panel/dashboard-entity-panel.header'
import {
	EntityCreateIconForm,
	EntityCreateIconIntent,
} from '#app/routes/resources+/api.v1+/entity.create.icon'
import { NewLayerDesignSchema } from './design.schema.create'
import { designTypeEnum } from '../design/definitions'

export const CreateLayerDesignForm = memo(
	({ entityType, type, parent }: CreateChildEntityFormProps) => {
		const designType = type as designTypeEnum
		const parentId = parent.id
		const formId = generateParentFormId({
			action: 'create',
			parentType: 'layer',
			parentId,
			entityType,
		})
		const intent = EntityCreateIconIntent.LAYER.DESIGN

		return (
			<EntityCreateIconForm
				formId={formId}
				intent={intent}
				schema={NewLayerDesignSchema}
				type={designType}
			>
				<div className="hidden">
					<HiddenInputLayer id={parentId} />
					<HiddenInputDesignType type={designType} />
				</div>
			</EntityCreateIconForm>
		)
	},
)
CreateLayerDesignForm.displayName = 'CreateLayerDesignForm'
