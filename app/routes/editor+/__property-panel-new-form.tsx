import { useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { type Artboard } from '@prisma/client'
import { useFetcher } from '@remix-run/react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { Button } from '#app/components/ui/button'
import { Icon } from '#app/components/ui/icon'
import {
	Tooltip,
	TooltipTrigger,
	TooltipContent,
	TooltipProvider,
} from '#app/components/ui/tooltip'
import { type action } from '#app/root'
import { NewArtboardDesignSchema } from '#app/schema/design'
import { type AppearanceType } from '#app/utils/appearances'
import { useIsPending } from '#app/utils/misc'
import { INTENT } from './actions'

export const NewAppearancePanelForm = ({
	artboardId,
	appearanceType,
	tooltipContent,
}: {
	artboardId: Artboard['id']
	appearanceType: AppearanceType
	tooltipContent: string
}) => {
	const fetcher = useFetcher<typeof action>()
	const isPending = useIsPending()

	const [form] = useForm({
		id: 'panel-create-artboard-appearance',
		constraint: getFieldsetConstraint(NewArtboardDesignSchema),
	})

	return (
		<fetcher.Form method="POST" {...form.props}>
			<AuthenticityTokenInput />

			<input type="hidden" name="artboardId" value={artboardId} />
			<input type="hidden" name="appearanceType" value={appearanceType} />
			<input
				type="hidden"
				name="intent"
				value={INTENT.createArtboardAppearance}
			/>
			<div className="flex gap-2">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								type="submit"
								variant="ghost"
								className="flex h-8 w-8 cursor-pointer items-center justify-center"
								disabled={isPending}
							>
								<Icon name="plus">
									<span className="sr-only">Add New</span>
								</Icon>
							</Button>
						</TooltipTrigger>
						<TooltipContent>{tooltipContent}</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
		</fetcher.Form>
	)
}