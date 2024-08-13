import { memo } from 'react'
import { type DynamicFormFieldConfig } from '#app/components/templates/form/dynamic-form-field.js'
import {
	HiddenInputExampleEntityId,
	HiddenInputId,
} from '#app/components/ui/input-hidden'
import {
	EntityCreateDialogForm,
	EntityCreateDialogIntent,
} from '#app/routes/resources+/api.v1+/entity.create.dialog'
import { generateParentFormId } from '#app/utils/form-id'
import { type IExampleEntity } from './entity._._definitions'
import { CloneExampleEntityExampleChildSchema } from './entity.child.clone.schema'

const CloneVersionContent = () => {
	return (
		<p className="body-md pt-4">
			👍 Here is what happens after you clone this entity...
		</p>
	)
}

const CloneVersionContentWarning = () => {
	return (
		<p className="body-md pt-4 text-destructive">
			🚨 Here is what happens after you clone this entity... are you sure?
		</p>
	)
}

export const CloneExampleEntityExampleChildForm = memo(
	({ parent, child }: { parent: IExampleEntity; child: IExampleEntity }) => {
		const parentId = parent.id
		const formId = generateParentFormId({
			action: 'clone',
			parentType: 'example-parent',
			parentId: parentId,
			entityType: 'example-child',
		})
		const intent = EntityCreateDialogIntent.EXAMPLE_PARENT.EXAMPLE_CHILD

		const description =
			'Save current progress for this entity. You will be able to undo this progress later or come back to where you left off here.'

		// also do not have to display content at all
		const contentDisplayWarning = parent.name === child.name

		const formFields: DynamicFormFieldConfig[] = [
			// TODO: this is a good idea to add a hidden input for the parentId in the formFields array as a json object
			// {
			//   type: 'hidden',
			//   name: 'parentId',
			//   value: parentId,
			// },
			{
				type: 'input',
				name: 'name',
				label: 'Name',
				options: {
					autoFocus: true,
				},
			},
			{
				type: 'textarea',
				name: 'description',
				label: 'Description',
			},
		]

		const handleSuccessfulSubmission = (data: any) => {
			// do something
		}

		return (
			<EntityCreateDialogForm
				formId={formId}
				intent={intent}
				schema={CloneExampleEntityExampleChildSchema}
				icon="plus" // change icon
				iconText="New Entity..."
				title="Save Entity"
				description={description}
				formFields={formFields}
				content={
					contentDisplayWarning ? (
						<CloneVersionContentWarning />
					) : (
						<CloneVersionContent />
					)
				}
				onSuccessfulSubmission={handleSuccessfulSubmission}
			>
				<div className="hidden">
					<HiddenInputId id={child.id} />
					<HiddenInputExampleEntityId id={parentId} />
				</div>
			</EntityCreateDialogForm>
		)
	},
)
CloneExampleEntityExampleChildForm.displayName =
	'CloneExampleEntityExampleChildForm'
