import { memo } from 'react'
import { HiddenInputId, IntentInput } from '#app/components/ui/input-hidden'
import { INTENT } from '#app/constants/intent'
import { UpdateDesignTypeAttributeSelectForm } from '#app/routes/resources+/api.v1+/update.design.type.attribute.select'
import { generateEntityFormId } from '#app/utils/form-id'
import { type IDesignFill } from './definitions'
import { FillStyleTypeEnum } from './schema'
import { EditDesignFillStyleSchema } from './schema.update'

interface DesignFillFormProps {
	fill: IDesignFill
	formIdsuffix?: string
}

const entity = 'fill'
const field = 'style'

export const UpdateDesignFillStyleForm = memo(
	({ fill, formIdsuffix }: DesignFillFormProps) => {
		const formId = generateEntityFormId({
			action: 'update',
			entityType: `design-type-${entity}`,
			entityId: fill.id,
			field,
			suffix: formIdsuffix,
		})
		const intent = INTENT.DESIGN.UPDATE.TYPE.ATTRIBUTE.SELECT.FILL_STYLE

		return (
			<UpdateDesignTypeAttributeSelectForm
				formId={formId}
				schema={EditDesignFillStyleSchema}
				fieldName={field}
				fieldValue={fill.attributes[field]}
				enumSchema={FillStyleTypeEnum}
				tooltipText={`Update ${entity} ${field}`}
				placeholder={`Select a ${field}`}
			>
				<div className="hidden">
					<IntentInput intent={intent} />
					<HiddenInputId id={fill.id} />
				</div>
			</UpdateDesignTypeAttributeSelectForm>
		)
	},
)
UpdateDesignFillStyleForm.displayName = 'UpdateDesignFillStyleForm'
