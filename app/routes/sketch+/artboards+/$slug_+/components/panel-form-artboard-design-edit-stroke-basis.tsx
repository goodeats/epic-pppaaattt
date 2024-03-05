import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { type Artboard } from '@prisma/client'
import { useActionData, useFetcher } from '@remix-run/react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '#app/components/ui/select'
import { type IStroke } from '#app/models/stroke.server'
import { EditArtboardStrokeBasisSchema } from '#app/schema/stroke'
import { useIsPending } from '#app/utils/misc'
import { INTENT } from '../intent'
import { type action } from '../route'

export const PanelFormArtboardDesignEditStrokeBasis = ({
	artboardId,
	stroke,
}: {
	artboardId: Artboard['id']
	stroke: IStroke
}) => {
	const fetcher = useFetcher<typeof action>()
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form, fields] = useForm({
		id: `panel-form-artboard-design-edit-stroke-${stroke.id}-basis`,
		constraint: getFieldsetConstraint(EditArtboardStrokeBasisSchema),
		lastSubmission: actionData?.submission,
		defaultValue: {
			...stroke,
		},
	})

	const handleChange = (value: string) => {
		fetcher.submit(form.ref.current, {
			method: 'POST',
		})
	}

	return (
		<fetcher.Form
			method="POST"
			{...form.props}
			className={'col-span-2 flex h-8'}
		>
			<AuthenticityTokenInput />

			<input type="hidden" name="id" value={stroke.id} />
			<input type="hidden" name="artboardId" value={artboardId} />
			<input type="hidden" name="designId" value={stroke.designId} />
			<input
				type="hidden"
				name="intent"
				value={INTENT.artboardUpdateDesignStrokeBasis}
			/>
			<Select
				onValueChange={value => handleChange(value)}
				disabled={isPending}
				{...conform.input(fields.basis)}
			>
				<SelectTrigger>
					<SelectValue placeholder="Select a format" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="defined">Defined</SelectItem>
					<SelectItem value="random">Random</SelectItem>
					<SelectItem value="palette">Palette</SelectItem>
					<SelectItem value="pixel">Pixel</SelectItem>
				</SelectContent>
			</Select>
		</fetcher.Form>
	)
}
