import { useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { type FetcherWithComponents } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { type z } from 'zod'
import { DialogContentGrid } from '#app/components/layout/dialog'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '#app/components/ui/dialog'
import { type IconName } from '#app/components/ui/icon'
import { NoJsInput } from '#app/components/ui/input-hidden'
import { PanelIconButton } from '#app/components/ui/panel-icon-button'
import { StatusButton } from '#app/components/ui/status-button'
import { useIsPending } from '#app/utils/misc'
import { TooltipHydrated } from '../tooltip'
import {
	DynamicFormFields,
	type DynamicFormFieldConfig,
} from './dynamic-form-field'

export const FetcherIconDialog = ({
	fetcher,
	route,
	schema,
	formId,
	icon,
	iconText,
	tooltipText,
	title,
	description,
	formFields,
	children,
	content,
	isHydrated,
	onSuccessfulSubmission,
}: {
	fetcher: FetcherWithComponents<any>
	route: string
	schema: z.ZodSchema<any>
	formId: string
	icon: IconName
	iconText: string
	tooltipText?: string
	title: string
	description?: string
	formFields: DynamicFormFieldConfig[]
	children: JSX.Element
	content?: JSX.Element
	isHydrated: boolean
	onSuccessfulSubmission: (data: any) => void
}) => {
	const [open, setOpen] = useState(false)

	const lastSubmission = fetcher.data?.submission
	const isPending = useIsPending()
	const [form, fields] = useForm({
		id: formId,
		constraint: getFieldsetConstraint(schema),
		lastSubmission,
	})

	useEffect(() => {
		if (fetcher.state === 'idle' && fetcher.data?.status === 'success') {
			// close dialog on successful submission
			setOpen(false)
			// parent component may want to do something
			// such as navigate to a new page
			onSuccessfulSubmission(fetcher.data)
		}
	}, [fetcher, onSuccessfulSubmission])

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<TooltipHydrated
				tooltipText={tooltipText || iconText}
				isHydrated={isHydrated}
			>
				<DialogTrigger asChild>
					<PanelIconButton iconName={icon} iconText={iconText} />
				</DialogTrigger>
			</TooltipHydrated>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					{description && <DialogDescription>{description}</DialogDescription>}
				</DialogHeader>
				<DialogContentGrid>
					<fetcher.Form method="POST" action={route} {...form.props}>
						<AuthenticityTokenInput />
						<NoJsInput value={String(!isHydrated)} />
						{/* hidden field values */}
						{/* and user input form fields */}
						{children}
						<DynamicFormFields formFields={formFields} fields={fields} />
					</fetcher.Form>
					{/* additional content after the form fields */}
					{content}
				</DialogContentGrid>
				<DialogFooter>
					<StatusButton
						form={form.id}
						type="submit"
						disabled={isPending}
						status={isPending ? 'pending' : 'idle'}
					>
						Submit
					</StatusButton>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
