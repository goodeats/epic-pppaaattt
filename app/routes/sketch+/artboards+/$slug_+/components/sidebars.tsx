import { Sidebar } from '#app/components/layout'
import { SidebarTabs, SidebarTabsContent } from '#app/components/templates'
import { type IDesignsByType } from '#app/models/design.server'
import { type ILayer } from '#app/models/layer.server'
import { type PickedArtboardType } from '../queries'
import { PanelContentArtboardDesigns } from './panel/artboard/panel-content-artboard-designs'
import { PanelContentArtboardLayers } from './panel/artboard/panel-content-artboard-layers'
import { PanelContentLayerDesigns } from './panel/layer/panel-content-layer-designs'

export const SidebarLeft = ({
	artboard,
	layers,
}: {
	artboard: PickedArtboardType
	layers: ILayer[]
}) => {
	return (
		<Sidebar id="sidebar-left">
			<SidebarTabs tabs={['display', 'assets']}>
				<SidebarTabsContent value="display">
					<PanelContentArtboardLayers artboard={artboard} layers={layers} />
				</SidebarTabsContent>
				<SidebarTabsContent value="assets">
					Add assets like images here
				</SidebarTabsContent>
			</SidebarTabs>
		</Sidebar>
	)
}

export const SidebarRight = ({
	artboard,
	artboardDesigns,
	layer,
	layerDesigns,
}: {
	artboard: PickedArtboardType
	artboardDesigns: IDesignsByType
	layer: ILayer | null | undefined
	layerDesigns: IDesignsByType | null | undefined
}) => {
	const layerPanel = layer && layerDesigns

	return (
		<Sidebar id="sidebar-right">
			<SidebarTabs tabs={['designs', 'actions']}>
				<SidebarTabsContent value="designs">
					{layerPanel ? (
						<PanelContentLayerDesigns layer={layer} designs={layerDesigns} />
					) : (
						<PanelContentArtboardDesigns
							artboard={artboard}
							designs={artboardDesigns}
						/>
					)}
				</SidebarTabsContent>
				<SidebarTabsContent value="actions">
					Add actions like download and duplicate here
				</SidebarTabsContent>
			</SidebarTabs>
		</Sidebar>
	)
}
