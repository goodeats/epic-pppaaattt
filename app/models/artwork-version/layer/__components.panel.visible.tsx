import { generateEntityFormId } from '#app/utils/form-id'
import { memo } from 'react'
import {
	HiddenInputArtworkVersion,
	HiddenInputId,
} from '#app/components/ui/input-hidden'
import {
	EntityToggleAttributeForm,
	EntityToggleAttributeIntent,
} from '#app/routes/resources+/api.v1+/entity.toggle.attribute'
import { ToggleVisibleChildEntityFormProps } from '#app/components/templates/panel/dashboard-entity-panel.actions.update.visible'
import { ILayer } from '#app/models/layer/definitions'
import { UpdateArtworkVersionLayerFieldSchema } from './schema.update'

export const ToggleArtworkVersionLayerVisibleForm = memo(
	({ entityType, entity, parent }: ToggleVisibleChildEntityFormProps) => {
		const layer = entity as ILayer
		const formId = generateEntityFormId({
			action: 'update',
			entityType,
			entityId: entity.id,
			field: 'visible',
			suffix: 'toggle',
		})
		const intent = EntityToggleAttributeIntent.ARTWORK_VERSION.LAYER.VISIBLE
		return (
			<EntityToggleAttributeForm
				formId={formId}
				intent={intent}
				schema={UpdateArtworkVersionLayerFieldSchema}
				condition={layer.visible}
				iconTrue="eye-open"
				iconTrueText={`Hide ${layer.name}`}
				iconFalse="eye-closed"
				iconFalseText={`Show ${layer.name}`}
			>
				<div className="hidden">
					<HiddenInputId id={layer.id} />
					<HiddenInputArtworkVersion id={parent.id} />
				</div>
			</EntityToggleAttributeForm>
		)
	},
)
ToggleArtworkVersionLayerVisibleForm.displayName =
	'ToggleArtworkVersionLayerVisibleForm'
