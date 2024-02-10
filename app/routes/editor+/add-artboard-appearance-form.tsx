import { conform, useForm } from '@conform-to/react'
import { parse } from '@conform-to/zod'
import { type Appearance, type Artboard } from '@prisma/client'
import { type SerializeFrom } from '@remix-run/node'
import { useActionData, useFetcher, useLoaderData } from '@remix-run/react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { CheckboxField } from '#app/components/forms'
import {
	ContainerP,
	DialogFormFieldsContainer,
	FormContainer,
} from '#app/components/shared'
import { Button } from '#app/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '#app/components/ui/dialog'
import { HiddenSubmitButton } from '#app/components/ui/hidden-submit-button'
import { Icon } from '#app/components/ui/icon'
import { StatusButton } from '#app/components/ui/status-button'
import { appearanceMapping, type AppearanceType } from '#app/utils/appearances'
import { useIsPending } from '#app/utils/misc'
import { AddArtboardAppearancesEditorSchema, INTENT } from './actions'
import { type loader, type action } from './route'

export function AddArtboardAppearanceForm({
	artboard,
	artboardAppearances,
	appearanceType,
}: {
	artboard: SerializeFrom<Pick<Artboard, 'id'>>
	artboardAppearances: Array<
		Pick<Appearance, 'id' | 'name' | 'description' | 'value'>
	>
	appearanceType: AppearanceType
}) {
	const data = useLoaderData<typeof loader>()
	const artboardAppearanceIds = artboardAppearances.map(artboard => artboard.id)

	const { appearances } = data
	const appearancesByTypeNotAlreadyOnArtboard = appearances.filter(
		appearance => {
			return (
				appearance.type === appearanceType &&
				!artboardAppearanceIds.includes(appearance.id)
			)
		},
	)
	const noAppearancesToAdd = appearancesByTypeNotAlreadyOnArtboard.length === 0

	const appearanceTypeName = appearanceMapping[appearanceType].typeName

	const fetcher = useFetcher()

	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form, fields] = useForm({
		id: `add-artboard-appearance-${appearanceType}`,
		lastSubmission: actionData?.submission,
		onSubmit: (event, { formData }) => {
			event.preventDefault()

			const submission = parse(formData, {
				schema: AddArtboardAppearancesEditorSchema,
			})
			if (!submission.value) {
				console.warn('no submission', submission)
				return
			}

			fetcher.submit(formData, {
				method: 'POST',
			})
		},
		defaultValue: {
			appearanceIds: artboardAppearanceIds ?? [],
		},
	})

	if (!artboard) return null

	const Appearances = () => {
		return (
			<div className="flex items-center justify-between space-x-2">
				<fieldset>
					<legend className="mb-4 text-lg">{appearanceTypeName}s</legend>
					{appearancesByTypeNotAlreadyOnArtboard.length === 0 && (
						<ContainerP>All {appearanceTypeName}s have been added</ContainerP>
					)}
					{appearancesByTypeNotAlreadyOnArtboard.map((appearance, i) => {
						const checkboxProps = conform.input(fields.appearanceIds, {
							type: 'checkbox',
							value: appearance.id,
						})

						// mutliple bug since checkbox is a button actually
						const { multiple, ...rest } = checkboxProps

						return (
							<CheckboxField
								key={appearance.id}
								labelProps={{
									htmlFor: checkboxProps.id,
									children: `${appearance.name}`,
								}}
								buttonProps={rest}
								defaultChecked={artboardAppearanceIds.includes(appearance.id)}
								errors={fields.appearanceIds.errors}
							/>
						)
					})}
				</fieldset>
			</div>
		)
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline">
					<Icon name="plus" className="scale-125">
						Add {appearanceTypeName}
					</Icon>
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Add {appearanceTypeName}</DialogTitle>
					<DialogDescription>
						Assign a {appearanceTypeName} to your artboard here. Click save when
						you're done.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<FormContainer>
						<fetcher.Form method="POST" {...form.props}>
							<AuthenticityTokenInput />
							<HiddenSubmitButton />
							<input type="hidden" name="artboardId" value={artboard.id} />
							<input
								type="hidden"
								name="intent"
								value={INTENT.addArtboardAppearances}
							/>
							<DialogFormFieldsContainer className="grid-cols-1">
								<Appearances />
							</DialogFormFieldsContainer>
						</fetcher.Form>
					</FormContainer>
					<DialogFooter>
						<Button form={form.id} variant="destructive" type="reset">
							Reset
						</Button>
						<StatusButton
							form={form.id}
							type="submit"
							disabled={isPending || noAppearancesToAdd}
							status={isPending ? 'pending' : 'idle'}
						>
							Save Changes
						</StatusButton>
					</DialogFooter>
				</div>
			</DialogContent>
		</Dialog>
	)
}