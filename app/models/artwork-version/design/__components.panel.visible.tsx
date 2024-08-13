import { memo } from 'react'
import { type ToggleVisibleChildEntityFormProps } from '#app/components/templates/panel/dashboard-entity-panel.actions.update.visible'
import {
	HiddenInputArtworkVersion,
	HiddenInputId,
} from '#app/components/ui/input-hidden'
import { type IDesign } from '#app/models/design/definitions'
import {
	EntityToggleAttributeForm,
	EntityToggleAttributeIntent,
} from '#app/routes/resources+/api.v1+/entity.toggle.attribute'
import { generateEntityFormId } from '#app/utils/form-id'
import { UpdateArtworkVersionDesignFieldSchema } from './schema.update'

export const ToggleArtworkVersionDesignVisibleForm = memo(
	({ entityType, entity, parent }: ToggleVisibleChildEntityFormProps) => {
		const design = entity as IDesign
		const formId = generateEntityFormId({
			action: 'update',
			entityType,
			entityId: entity.id,
			field: 'visible',
			suffix: 'toggle',
		})
		const intent = EntityToggleAttributeIntent.ARTWORK_VERSION.DESIGN.VISIBLE
		return (
			<EntityToggleAttributeForm
				formId={formId}
				intent={intent}
				schema={UpdateArtworkVersionDesignFieldSchema}
				condition={design.visible}
				iconTrue="eye-open"
				iconTrueText={`Hide ${design.type}`}
				iconFalse="eye-closed"
				iconFalseText={`Show ${design.type}`}
			>
				<div className="hidden">
					<HiddenInputId id={design.id} />
					<HiddenInputArtworkVersion id={parent.id} />
				</div>
			</EntityToggleAttributeForm>
		)
	},
)
ToggleArtworkVersionDesignVisibleForm.displayName =
	'ToggleArtworkVersionDesignVisibleForm'
