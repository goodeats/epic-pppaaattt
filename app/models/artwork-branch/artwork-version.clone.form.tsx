import { useNavigate, useParams } from '@remix-run/react'
import { memo } from 'react'
import { type DynamicFormFieldConfig } from '#app/components/templates/form/dynamic-form-field.js'
import {
	HiddenInputArtworkBranch,
	HiddenInputId,
} from '#app/components/ui/input-hidden'
import {
	EntityCreateDialogForm,
	EntityCreateDialogIntent,
} from '#app/routes/resources+/api.v1+/entity.create.dialog'
import { generateParentFormId } from '#app/utils/form-id'
import { IArtworkBranch } from './_._definitions'
import { CloneArtworkBranchArtworkVersionSchema } from './artwork-version.clone.schema'
import { IArtworkVersion } from '../artwork-version/definitions'

const CloneVersionContent = () => {
	return (
		<p className="body-md pt-4">
			To undo version history, just save a version from the last desired version
			before the "latest" and all existing versions after that will be replaced.
		</p>
	)
}

const CloneVersionContentWarning = () => {
	return (
		<p className="body-md pt-4 text-destructive">
			WARNING: Saving the version before "latest" will erase all versions after
			the current version. Consider creating a new branch instead if you want to
			keep the existing versions.
		</p>
	)
}

export const CloneArtworkBranchArtworkVersionForm = memo(
	({
		branch,
		version,
	}: {
		branch: IArtworkBranch
		version: IArtworkVersion
	}) => {
		const branchId = branch.id
		const formId = generateParentFormId({
			action: 'clone',
			parentType: 'artwork-branch',
			parentId: branchId,
			entityType: 'artwork-version',
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
					<HiddenInputId id={version.id} />
					<HiddenInputArtworkBranch id={branchId} />
				</div>
			</EntityCreateDialogForm>
		)
	},
)
CloneArtworkBranchArtworkVersionForm.displayName =
	'CloneArtworkBranchArtworkVersionForm'
