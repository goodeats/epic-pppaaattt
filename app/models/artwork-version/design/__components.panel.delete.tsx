import { INTENT } from '#app/constants/intent'
import { IDesign } from '#app/models/design/definitions'
import { generateEntityFormId } from '#app/utils/form-id'
import { memo } from 'react'
import {
	HiddenInputArtworkVersion,
	HiddenInputId,
	IntentInput,
} from '#app/components/ui/input-hidden'
import { DeleteDesignForm } from '#app/routes/resources+/api.v1+/delete.design'
import { DeleteArtworkVersionDesignSchema } from './schema.delete'
import { DeleteChildEntityFormProps } from '#app/components/templates/panel/dashboard-entity-panel.actions.delete'

export const DeleteArtworkVersionDesignForm = memo(
	({ entityType, entity, parent }: DeleteChildEntityFormProps) => {
		const design = entity as IDesign
		const formId = generateEntityFormId({
			action: 'delete',
			entityType,
			entityId: entity.id,
		})
		const intent = INTENT.DESIGN.DELETE.ARTWORK_VERSION

		return (
			<DeleteDesignForm
				design={design}
				formId={formId}
				schema={DeleteArtworkVersionDesignSchema}
			>
				<div className="hidden">
					<IntentInput intent={intent} />
					<HiddenInputId id={design.id} />
					<HiddenInputArtworkVersion id={parent.id} />
				</div>
			</DeleteDesignForm>
		)
	},
)
DeleteArtworkVersionDesignForm.displayName = 'DeleteArtworkVersionDesignForm'
