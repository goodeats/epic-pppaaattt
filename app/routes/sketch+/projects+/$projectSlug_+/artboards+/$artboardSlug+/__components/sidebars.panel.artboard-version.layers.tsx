import { DashboardEntityPanel } from '#app/components/templates/panel/dashboard-entity-panel'
import { type IArtboardVersionWithDesignsAndLayers } from '#app/models/artboard-version/artboard-version.server'
import { DesignParentTypeIdEnum } from '#app/schema/design'
import { DashboardPanelCreateArtboardVersionLayerStrategy } from '#app/strategies/component/dashboard-panel/create-entity.strategy'
import { DashboardPanelDeleteArtboardVersionLayerStrategy } from '#app/strategies/component/dashboard-panel/delete-entity.strategy'
import { DashboardPanelUpdateLayerValuesStrategy } from '#app/strategies/component/dashboard-panel/update-entity/update-entity-values.layer'
import { DashboardPanelUpdateArtboardVersionLayerTypeOrderStrategy } from '#app/strategies/component/dashboard-panel/update-entity-move.strategy'
import { DashboardPanelUpdateArtboardVersionLayerTypeVisibleStrategy } from '#app/strategies/component/dashboard-panel/update-entity-visible.strategy'

export const PanelArtboardVersionLayers = ({
	version,
}: {
	version: IArtboardVersionWithDesignsAndLayers
}) => {
	// const orderedDesigns = filterAndOrderDesignsByType({
	// 	designs: version.designs,
	// })
	// const designTypePanels = designsByTypeToPanelArray({
	// 	designs: orderedDesigns,
	// })

	const strategyEntityNew =
		new DashboardPanelCreateArtboardVersionLayerStrategy()
	const strategyReorder =
		new DashboardPanelUpdateArtboardVersionLayerTypeOrderStrategy()
	const strategyToggleVisible =
		new DashboardPanelUpdateArtboardVersionLayerTypeVisibleStrategy()
	const strategyEntityDelete =
		new DashboardPanelDeleteArtboardVersionLayerStrategy()
	const strategyEntityValues = new DashboardPanelUpdateLayerValuesStrategy()

	return (
		<div>
			<DashboardEntityPanel
				type="layer"
				parentTypeId={DesignParentTypeIdEnum.ARTBOARD_VERSION_ID}
				parent={version}
				entities={version.layers}
				strategyEntityNew={strategyEntityNew}
				strategyReorder={strategyReorder}
				strategyEntityValues={strategyEntityValues}
				strategyToggleVisible={strategyToggleVisible}
				strategyEntityDelete={strategyEntityDelete}
			/>
		</div>
	)
}
