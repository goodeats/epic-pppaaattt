import { useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { type FetcherWithComponents } from '@remix-run/react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { type z } from 'zod'
import { type IconName } from '#app/components/ui/icon'
import { NoJsInput } from '#app/components/ui/input-hidden'
import { PanelIconButton } from '#app/components/ui/panel-icon-button'
import { useIsPending } from '#app/utils/misc'
import { TooltipHydrated } from '../tooltip'

export const FetcherIconButtonReorder = ({
	fetcher,
	route,
	schema,
	formId,
	icon,
	iconText,
	tooltipText,
	disabled,
	isHydrated,
	children,
}: {
	fetcher: FetcherWithComponents<any>
	route: string
	schema: z.ZodSchema<any>
	formId: string
	icon: IconName
	iconText: string
	tooltipText?: string
	disabled: boolean
	isHydrated: boolean
	children: JSX.Element
}) => {
	// skip optimistic value for toggle now since
	// icons are different per parent component
	const lastSubmission = fetcher.data?.submission
	const isPending = useIsPending()
	const [form] = useForm({
		id: formId,
		constraint: getFieldsetConstraint(schema),
		lastSubmission,
	})

	return (
		<fetcher.Form method="POST" action={route} {...form.props}>
			<AuthenticityTokenInput />
			<NoJsInput value={String(!isHydrated)} />
			{/* hidden field values */}
			{children}

			<TooltipHydrated
				tooltipText={tooltipText || iconText}
				isHydrated={isHydrated}
			>
				<PanelIconButton
					type="submit"
					size="panel-sm"
					iconName={icon}
					iconText={iconText}
					disabled={disabled || isPending}
					className="my-0"
				/>
			</TooltipHydrated>
		</fetcher.Form>
	)
}
