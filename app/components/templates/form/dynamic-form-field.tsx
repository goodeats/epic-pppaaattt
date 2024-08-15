import { conform, type Fieldset, type FieldConfig } from '@conform-to/react'
import { Field, TextareaField } from '#app/components/forms'
import { DialogFormsContainer } from '#app/components/layout/dialog'

type DynamicFormFieldOptions = {
	autoFocus?: boolean
}

export type DynamicFormFieldConfig = {
	type: 'input' | 'textarea' // Add more field types as needed
	name: string
	label: string
	options?: DynamicFormFieldOptions
}

type DynamicFormFieldsProps = {
	formFields: DynamicFormFieldConfig[]
	fields: Fieldset<any>
}

// Field-specific components
const InputField = ({
	field,
	fieldConfig,
}: {
	field: FieldConfig<string>
	fieldConfig: DynamicFormFieldConfig
}) => (
	<Field
		key={fieldConfig.name}
		labelProps={{ children: fieldConfig.label }}
		inputProps={{
			autoFocus: fieldConfig.options?.autoFocus,
			...conform.input(field),
		}}
		errors={field.errors}
	/>
)

const TextareaFieldComponent = ({
	field,
	fieldConfig,
}: {
	field: FieldConfig<string>
	fieldConfig: DynamicFormFieldConfig
}) => (
	<TextareaField
		key={fieldConfig.name}
		labelProps={{ children: fieldConfig.label }}
		textareaProps={{
			...conform.textarea(field),
		}}
		errors={field.errors}
	/>
)

// Field type mapping
const fieldTypeComponentMap: Record<
	DynamicFormFieldConfig['type'],
	React.ComponentType<{
		field: FieldConfig<string>
		fieldConfig: DynamicFormFieldConfig
	}>
> = {
	input: InputField,
	textarea: TextareaFieldComponent,
}

// Helper function to render a field
const renderField = (
	fieldConfig: DynamicFormFieldConfig,
	field: FieldConfig<any>,
) => {
	const FieldComponent = fieldTypeComponentMap[fieldConfig.type]
	return FieldComponent ? (
		<FieldComponent
			key={fieldConfig.name}
			field={field as FieldConfig<string>}
			fieldConfig={fieldConfig}
		/>
	) : null
}

// Main component
export const DynamicFormFields = ({
	formFields,
	fields,
}: DynamicFormFieldsProps) => {
	if (formFields.length === 0) return null

	return (
		<DialogFormsContainer>
			{formFields.map(fieldConfig =>
				renderField(
					fieldConfig,
					fields[
						fieldConfig.name as keyof typeof fields
					] as unknown as FieldConfig<string>,
				),
			)}
		</DialogFormsContainer>
	)
}