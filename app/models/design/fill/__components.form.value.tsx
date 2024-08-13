import { memo } from 'react'
import { HiddenInputId, IntentInput } from '#app/components/ui/input-hidden'
import { INTENT } from '#app/constants/intent'
import { UpdateDesignTypeAttributeHexForm } from '#app/routes/resources+/api.v1+/update.design.type.attribute.hex'
import { generateEntityFormId } from '#app/utils/form-id'
import { type IDesignFill } from './definitions'
import { EditDesignFillValueSchema } from './schema.update'

interface DesignFillFormProps {
	fill: IDesignFill
	formIdsuffix?: string
}

const entity = 'fill'
const field = 'value'

export const UpdateDesignFillValueForm = memo(
	({ fill, formIdsuffix }: DesignFillFormProps) => {
		const formId = generateEntityFormId({
			action: 'update',
			entityType: `design-type-${entity}`,
			entityId: fill.id,
			field,
			suffix: formIdsuffix,
		})
		const intent = INTENT.DESIGN.UPDATE.TYPE.ATTRIBUTE.HEX.FILL_VALUE

		return (
			<UpdateDesignTypeAttributeHexForm
				formId={formId}
				schema={EditDesignFillValueSchema}
				fieldName={field}
				fieldValue={fill.attributes[field]}
				tooltipText={`Update ${entity} hex ${field}`}
				placeholder={`Enter hex ${field}`}
			>
				<div className="hidden">
					<IntentInput intent={intent} />
					<HiddenInputId id={fill.id} />
				</div>
			</UpdateDesignTypeAttributeHexForm>
		)
	},
)
UpdateDesignFillValueForm.displayName = 'UpdateDesignFillValueForm'
