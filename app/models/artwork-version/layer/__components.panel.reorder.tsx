import { memo } from 'react'
import { type ReorderChildEntityFormProps } from '#app/components/templates/panel/dashboard-entity-panel.reorder'
import {
	HiddenInput,
	HiddenInputArtworkVersion,
	HiddenInputId,
	IntentInput,
} from '#app/components/ui/input-hidden'
import { INTENT } from '#app/constants/intent'
import { UpdateLinkedListNodeMoveForm } from '#app/routes/resources+/api.v1+/update.linked-list.node.move'
import { generateParentReorderFormId } from '#app/utils/form-id'
import { UpdateArtworkVersionLayerReorderSchema } from './schema.update'

export const UpdateArtworkVersionReorderLayerForm = memo(
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
			parentType: 'artwork-version',
			parentId,
			entityType,
			entityId,
		})
		const formIdMoveDown = generateParentReorderFormId({
			action: 'move-down',
			parentType: 'artwork-version',
			parentId,
			entityType,
			entityId,
		})

		const intentMoveUp = INTENT.LAYER.UPDATE.REORDER.ARTWORK_VERSION.MOVE_UP
		const intentMoveDown = INTENT.LAYER.UPDATE.REORDER.ARTWORK_VERSION.MOVE_DOWN

		return (
			<>
				{/* move up */}
				<UpdateLinkedListNodeMoveForm
					formId={formIdMoveUp}
					schema={UpdateArtworkVersionLayerReorderSchema}
					direction="up"
					atTopOrBottom={atTop}
				>
					<div className="hidden">
						<HiddenInput name="direction" value="up" />
						<IntentInput intent={intentMoveUp} />
						<HiddenInputId id={entityId} />
						<HiddenInputArtworkVersion id={parentId} />
					</div>
				</UpdateLinkedListNodeMoveForm>
				{/* move down */}
				<UpdateLinkedListNodeMoveForm
					formId={formIdMoveDown}
					schema={UpdateArtworkVersionLayerReorderSchema}
					direction="down"
					atTopOrBottom={atBottom}
				>
					<div className="hidden">
						<HiddenInput name="direction" value="down" />
						<IntentInput intent={intentMoveDown} />
						<HiddenInputId id={entityId} />
						<HiddenInputArtworkVersion id={parentId} />
					</div>
				</UpdateLinkedListNodeMoveForm>
			</>
		)
	},
)
UpdateArtworkVersionReorderLayerForm.displayName =
	'UpdateArtworkVersionReorderLayerForm'
