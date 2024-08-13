import { ReorderChildEntityFormProps } from '#app/components/templates/panel/dashboard-entity-panel.reorder'
import { INTENT } from '#app/constants/intent'
import { generateParentReorderFormId } from '#app/utils/form-id'
import { memo } from 'react'
import {
	HiddenInput,
	HiddenInputId,
	HiddenInputLayer,
	IntentInput,
} from '#app/components/ui/input-hidden'
import { UpdateLinkedListNodeMoveForm } from '#app/routes/resources+/api.v1+/update.linked-list.node.move'
import { UpdateLayerDesignReorderSchema } from './design.schema.update'

export const UpdateLayerReorderDesignForm = memo(
	({
		entityType,
		entity,
		parent,
		atTop,
		atBottom,
	}: ReorderChildEntityFormProps) => {
		const entityId = entity.id
		const parentId = parent.id
		const formIdMoveUp = generateParentReorderFormId({
			action: 'move-up',
			parentType: 'layer',
			parentId,
			entityType,
			entityId,
		})
		const formIdMoveDown = generateParentReorderFormId({
			action: 'move-down',
			parentType: 'layer',
			parentId,
			entityType,
			entityId,
		})

		const intentMoveUp = INTENT.DESIGN.UPDATE.REORDER.LAYER.MOVE_UP
		const intentMoveDown = INTENT.DESIGN.UPDATE.REORDER.LAYER.MOVE_DOWN

		return (
			<>
				{/* move up */}
				<UpdateLinkedListNodeMoveForm
					formId={formIdMoveUp}
					schema={UpdateLayerDesignReorderSchema}
					direction="up"
					atTopOrBottom={atTop}
				>
					<div className="hidden">
						<HiddenInput name="direction" value="up" />
						<IntentInput intent={intentMoveUp} />
						<HiddenInputId id={entityId} />
						<HiddenInputLayer id={parentId} />
					</div>
				</UpdateLinkedListNodeMoveForm>
				{/* move down */}
				<UpdateLinkedListNodeMoveForm
					formId={formIdMoveDown}
					schema={UpdateLayerDesignReorderSchema}
					direction="down"
					atTopOrBottom={atBottom}
				>
					<div className="hidden">
						<HiddenInput name="direction" value="down" />
						<IntentInput intent={intentMoveDown} />
						<HiddenInputId id={entityId} />
						<HiddenInputLayer id={parentId} />
					</div>
				</UpdateLinkedListNodeMoveForm>
			</>
		)
	},
)
UpdateLayerReorderDesignForm.displayName = 'UpdateLayerReorderDesignForm'
