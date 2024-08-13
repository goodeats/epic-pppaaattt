import { memo } from 'react'
import { type ToggleVisibleChildEntityFormProps } from '#app/components/templates/panel/dashboard-entity-panel.actions.update.visible'
import {
	HiddenInputId,
	HiddenInputLayer,
} from '#app/components/ui/input-hidden'
import { type IDesign } from '#app/models/design/definitions'
import {
	EntityToggleAttributeForm,
	EntityToggleAttributeIntent,
} from '#app/routes/resources+/api.v1+/entity.toggle.attribute'
import { generateEntityFormId } from '#app/utils/form-id'
import { UpdateLayerDesignFieldSchema } from './design.schema.update'

export const ToggleLayerDesignVisibleForm = memo(
	({ entityType, entity, parent }: ToggleVisibleChildEntityFormProps) => {
		const design = entity as IDesign
		const formId = generateEntityFormId({
			action: 'update',
			entityType,
			entityId: entity.id,
			field: 'visible',
			suffix: 'toggle',
		})
		const intent = EntityToggleAttributeIntent.LAYER.DESIGN.VISIBLE
		return (
			<EntityToggleAttributeForm
				formId={formId}
				intent={intent}
				schema={UpdateLayerDesignFieldSchema}
				condition={design.visible}
				iconTrue="eye-open"
				iconTrueText={`Hide ${design.type}`}
				iconFalse="eye-closed"
				iconFalseText={`Show ${design.type}`}
			>
				<div className="hidden">
					<HiddenInputId id={design.id} />
					<HiddenInputLayer id={parent.id} />
				</div>
			</EntityToggleAttributeForm>
		)
	},
)
ToggleLayerDesignVisibleForm.displayName = 'ToggleLayerDesignVisibleForm'
