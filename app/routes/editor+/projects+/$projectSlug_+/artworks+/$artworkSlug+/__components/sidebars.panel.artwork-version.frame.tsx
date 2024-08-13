import {
	SidebarPanel,
	SidebarPanelHeader,
	SidebarPanelRow,
	SidebarPanelRowContainer,
	SidebarPanelRowValuesContainer,
} from '#app/components/templates'
import { type IArtworkVersionWithChildren } from '#app/models/artwork-version/definitions'
import { ArtworkVersionHeight } from '#app/routes/resources+/api.v1+/artwork-version.update.height'
import { ArtworkVersionWidth } from '#app/routes/resources+/api.v1+/artwork-version.update.width'

export const PanelArtworkVersionFrame = ({
	version,
}: {
	version: IArtworkVersionWithChildren
}) => {
	return (
		<SidebarPanel>
			<SidebarPanelHeader title="Frame" />
			<SidebarPanelRow>
				<SidebarPanelRowContainer>
					<SidebarPanelRowValuesContainer>
						<ArtworkVersionWidth version={version} />
						<ArtworkVersionHeight version={version} />
					</SidebarPanelRowValuesContainer>
				</SidebarPanelRowContainer>
			</SidebarPanelRow>
		</SidebarPanel>
	)
}
