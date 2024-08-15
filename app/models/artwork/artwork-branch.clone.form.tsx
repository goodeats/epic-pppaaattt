import { useNavigate } from '@remix-run/react'
import { memo } from 'react'
import { type DynamicFormFieldConfig } from '#app/components/templates/form/dynamic-form-field.js'
import {
	HiddenInputArtwork,
	HiddenInputId,
} from '#app/components/ui/input-hidden'
import {
	EntityCreateDialogForm,
	EntityCreateDialogIntent,
} from '#app/routes/resources+/api.v1+/entity.create.dialog'
import { generateParentFormId } from '#app/utils/form-id'
import { stringToSlug } from '#app/utils/misc.js'
import { type IArtworkBranch } from '../artwork-branch/_._definitions'
import { CloneArtworkBranchArtworkVersionSchema } from '../artwork-branch/artwork-version.clone.schema'
import { type IArtwork } from './artwork.server'

export const CloneArtworkArtworkBranchForm = memo(
	({ artwork, branch }: { artwork: IArtwork; branch: IArtworkBranch }) => {
		const formId = generateParentFormId({
			action: 'clone',
			parentType: 'artwork',
			parentId: artwork.id,
			entityType: 'artwork-branch',
		})
		const intent = EntityCreateDialogIntent.ARTWORK.ARTWORK_BRANCH

		const description =
			'Start a new branch for this artwork off the current settings. Add a name and description to help understand the changes.'

		const formFields: DynamicFormFieldConfig[] = [
			{
				type: 'input',
				name: 'name',
				label: 'Name',
			},
			{
				type: 'textarea',
				name: 'description',
				label: 'Description',
			},
		]

		const navigate = useNavigate()
		const handleSuccessfulSubmission = (data: any) => {
			const newBranchName = data.submission.value.name
			const newBranchSlug = stringToSlug(newBranchName)
			navigate(`../../${newBranchSlug}`)
		}

		return (
			<EntityCreateDialogForm
				formId={formId}
				intent={intent}
				schema={CloneArtworkBranchArtworkVersionSchema}
				icon="file-plus"
				iconText="New Branch..."
				title="New Branch"
				description={description}
				formFields={formFields}
				onSuccessfulSubmission={handleSuccessfulSubmission}
			>
				<div className="hidden">
					<HiddenInputId id={branch.id} />
					<HiddenInputArtwork id={artwork.id} />
				</div>
			</EntityCreateDialogForm>
		)
	},
)
CloneArtworkArtworkBranchForm.displayName = 'CloneArtworkArtworkBranchForm'
