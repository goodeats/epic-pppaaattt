import { INTENT } from '#app/constants/intent'
import { IDesign } from '#app/models/design/definitions'
import { generateEntityFormId } from '#app/utils/form-id'
import { memo } from 'react'
import {
	HiddenInputId,
	HiddenInputLayer,
	IntentInput,
} from '#app/components/ui/input-hidden'
import { DeleteDesignForm } from '#app/routes/resources+/api.v1+/delete.design'
import { DeleteChildEntityFormProps } from '#app/components/templates/panel/dashboard-entity-panel.actions.delete'
import { DeleteLayerDesignSchema } from '#app/schema/design-layer'

export const DeleteLayerDesignForm = memo(
	({ entityType, entity, parent }: DeleteChildEntityFormProps) => {
		const design = entity as IDesign
		const formId = generateEntityFormId({
			action: 'delete',
			entityType,
			entityId: entity.id,
		})
		const intent = INTENT.DESIGN.DELETE.LAYER

		return (
			<DeleteDesignForm
				design={design}
				formId={formId}
				schema={DeleteLayerDesignSchema}
			>
				<div className="hidden">
					<IntentInput intent={intent} />
					<HiddenInputId id={design.id} />
					<HiddenInputLayer id={parent.id} />
				</div>
			</DeleteDesignForm>
		)
	},
)
DeleteLayerDesignForm.displayName = 'DeleteLayerDesignForm'
