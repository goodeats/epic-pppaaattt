import { memo } from 'react'
import { NavbarButtonGroup } from '#app/components/layout'
import { TooltipIconLink } from '#app/components/templates/navbar'
import { CloneArtworkArtworkBranchForm } from '#app/models/artwork/artwork-branch.clone.form.js'
import { type IArtwork } from '#app/models/artwork/artwork.server'
import { type IArtworkBranch } from '#app/models/artwork-branch/_._definitions.js'
import { CloneArtworkBranchArtworkVersionForm } from '#app/models/artwork-branch/artwork-version.clone.form.js'
import { type IArtworkVersion } from '#app/models/artwork-version/definitions'
import { ArtworkVersionToggleStarred } from '#app/routes/resources+/api.v1+/artwork-version.update.starred'
import { useUser } from '#app/utils/user'

export const NavActionsButtonGroup = memo(
	({
		artwork,
		branch,
		version,
	}: {
		artwork: IArtwork
		branch: IArtworkBranch
		version: IArtworkVersion
	}) => {
		const user = useUser()

		// TODO: make these have the same look as the form fetcher icon */}
		return (
			<NavbarButtonGroup>
				{/* <span>refresh</span> */}
				{/* <span>star</span> */}
				{/* <span>info a, ab, abv</span> */}
				{/* <span>fork ab</span> */}
				{/* <span>merge ab</span> */}
				<ArtworkVersionToggleStarred version={version} />
				{/* <ArtworkBranchCreate
					branchId={branch.id}
					artworkId={artwork.id}
					versionId={version.id}
				/> */}
				<CloneArtworkArtworkBranchForm
					artwork={artwork}
					branch={branch}
					version={version}
				/>
				<CloneArtworkBranchArtworkVersionForm
					branch={branch}
					version={version}
				/>
				<TooltipIconLink
					to={`/users/${user.username}/artworks/${artwork.slug}`}
					icon="exit"
					text="Latest"
					tooltipText={`Go to ${artwork.name} page`}
					buttonVariant="ghost"
				/>
			</NavbarButtonGroup>
		)
	},
)
NavActionsButtonGroup.displayName = 'NavActionsButtonGroup'
