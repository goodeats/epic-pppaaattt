import { useNavigate, useParams } from '@remix-run/react'
import { memo } from 'react'
import { type DynamicFormFieldConfig } from '#app/components/templates/form/dynamic-form-field.js'
import {
	HiddenInputArtwork,
	HiddenInputArtworkVersion,
	HiddenInputId,
} from '#app/components/ui/input-hidden'
import {
	EntityCreateDialogForm,
	EntityCreateDialogIntent,
} from '#app/routes/resources+/api.v1+/entity.create.dialog'
import { generateParentFormId } from '#app/utils/form-id'
import { type IArtworkBranch } from '../artwork-branch/_._definitions'
import { CloneArtworkBranchArtworkVersionSchema } from '../artwork-branch/artwork-version.clone.schema'
import { type IArtworkVersion } from '../artwork-version/definitions'
import { type IArtwork } from './artwork.server'

// Reminder that this is an option if the file is copied
const CloneVersionContent = () => {
	return null
}

const CloneVersionContentWarning = () => {
	return null
}

export const CloneArtworkArtworkBranchForm = memo(
	({
		artwork,
		branch,
		version,
	}: {
		artwork: IArtwork
		branch: IArtworkBranch
		version: IArtworkVersion
	}) => {
		const formId = generateParentFormId({
			action: 'clone',
			parentType: 'artwork',
			parentId: artwork.id,
			entityType: 'artwork-branch',
		})
		const intent = EntityCreateDialogIntent.ARTWORK_BRANCH.ARTWORK_VERSION

		const description =
			'Save current settings of this artwork to a version. Add a description to help understand the changes. A new version will be created from here.'

		const formFields: DynamicFormFieldConfig[] = [
			{
				type: 'textarea',
				name: 'description',
				label: 'Description',
			},
		]

		const onLatestVersion = version.nextId === null

		const params = useParams()
		const navigate = useNavigate()
		const handleSuccessfulSubmission = () => {
			if (params.versionSlug !== 'latest') {
				// navigate to latest version if not already on that route
				navigate('../latest')
			}
		}

		return (
			<EntityCreateDialogForm
				formId={formId}
				intent={intent}
				schema={CloneArtworkBranchArtworkVersionSchema}
				icon="card-stack-plus"
				iconText="New Version..."
				title="Save Version"
				description={description}
				formFields={formFields}
				content={
					onLatestVersion ? (
						<CloneVersionContent />
					) : (
						<CloneVersionContentWarning />
					)
				}
				onSuccessfulSubmission={handleSuccessfulSubmission}
			>
				<div className="hidden">
					<HiddenInputId id={branch.id} />
					<HiddenInputArtwork id={artwork.id} />
					<HiddenInputArtworkVersion id={version.id} />
				</div>
			</EntityCreateDialogForm>
		)
	},
)
CloneArtworkArtworkBranchForm.displayName = 'CloneArtworkArtworkBranchForm'
