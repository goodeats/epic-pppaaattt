import { memo } from 'react'
import { HiddenInputId, IntentInput } from '#app/components/ui/input-hidden'
import { INTENT } from '#app/constants/intent'
import { UpdateDesignTypeAttributeSelectForm } from '#app/routes/resources+/api.v1+/update.design.type.attribute.select'
import { generateEntityFormId } from '#app/utils/form-id'
import { type IDesignFill } from './definitions'
import { FillBasisTypeEnum } from './schema'
import { EditDesignFillBasisSchema } from './schema.update'

interface DesignFillFormProps {
	fill: IDesignFill
	formIdsuffix?: string
}

const entity = 'fill'
const field = 'basis'

export const UpdateDesignFillBasisForm = memo(
	({ fill, formIdsuffix }: DesignFillFormProps) => {
		const formId = generateEntityFormId({
			action: 'update',
			entityType: `design-type-${entity}`,
			entityId: fill.id,
			field,
			suffix: formIdsuffix,
		})
		const intent = INTENT.DESIGN.UPDATE.TYPE.ATTRIBUTE.SELECT.FILL_BASIS

		return (
			<UpdateDesignTypeAttributeSelectForm
				formId={formId}
				schema={EditDesignFillBasisSchema}
				fieldName={field}
				fieldValue={fill.attributes[field]}
				enumSchema={FillBasisTypeEnum}
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
UpdateDesignFillBasisForm.displayName = 'UpdateDesignFillBasisForm'
