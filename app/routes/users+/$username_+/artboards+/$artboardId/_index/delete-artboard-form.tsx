import { useForm } from '@conform-to/react'
import { Form, useActionData } from '@remix-run/react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { ErrorList } from '#app/components/forms'
import {
	FormDeleteIcon,
	formDeleteButtonDefaultClassName,
} from '#app/components/shared'
import { StatusButton } from '#app/components/ui/status-button'
import { useIsPending } from '#app/utils/misc'
import { type action } from './route'

export function DeletePermission({ id }: { id: string }) {
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()
	const [form] = useForm({
		id: 'delete-artboard',
		lastSubmission: actionData?.submission,
	})

	return (
		<Form method="POST" {...form.props}>
			<AuthenticityTokenInput />
			<input type="hidden" name="artboardId" value={id} />
			<StatusButton
				type="submit"
				name="intent"
				value="delete-artboard"
				variant="destructive"
				status={isPending ? 'pending' : actionData?.status ?? 'idle'}
				disabled={isPending}
				className={formDeleteButtonDefaultClassName}
			>
				<FormDeleteIcon />
			</StatusButton>
			<ErrorList errors={form.errors} id={form.errorId} />
		</Form>
	)
}
