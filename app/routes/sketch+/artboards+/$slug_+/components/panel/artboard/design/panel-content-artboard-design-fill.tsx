import {
	SidebarPanel,
	SidebarPanelRow,
	SidebarPanelRowContainer,
	SidebarPanelRowValuesContainer,
	SidebarPanelRowValuesDisabled,
} from '#app/components/templates'
import { type IDesignWithFill } from '#app/models/design.server'
import { DesignTypeEnum } from '#app/schema/design'
import {
	panelItemVariablesDesignType,
	panelListVariablesDesignType,
	selectedDesignsOnUpdate,
} from '#app/utils/design'
import { type PickedArtboardType } from '../../../../queries'
import { PanelFormDesignFillEditValue } from '../../../forms/design/panel-form-design-fill-edit-value'
import { PanelPopoverDesignFill } from '../../../popovers/design/panel-popover-design-fill'
import { SidebarPanelActionsArtboardDesign } from './sidebar-panel-actions-artboard-design'
import { SidebarPanelHeaderArtboardDesign } from './sidebar-panel-header-artboard-design'
import { SidebarPanelReorderArtboardDesign } from './sidebar-panel-reorder-artboard-design'

export const PanelContentArtboardDesignFill = ({
	artboard,
	designFills,
}: {
	artboard: PickedArtboardType
	designFills: IDesignWithFill[]
}) => {
	const {
		orderedDesignIds,
		designCount,
		visibleDesignIds,
		firstVisibleDesignId,
		selectedDesignId,
	} = panelListVariablesDesignType({
		designs: designFills,
	})

	return (
		<SidebarPanel>
			<SidebarPanelHeaderArtboardDesign
				type={DesignTypeEnum.FILL}
				artboardId={artboard.id}
				visibleDesignsCount={visibleDesignIds.length}
			/>

			{designFills.map((design, index) => {
				const { id, visible, fill } = design

				const {
					isSelectedDesign,
					nextDesignId,
					prevDesignId,
					nextVisibleDesignId,
				} = panelItemVariablesDesignType({
					id,
					selectedDesignId,
					orderedDesignIds,
					visibleDesignIds,
				})

				const {
					selectDesignIdOnMoveUp,
					selectDesignIdOnMoveDown,
					selectDesignIdOnToggleVisible,
					selectDesignIdOnDelete,
				} = selectedDesignsOnUpdate({
					id,
					selectedDesignId,
					isSelectedDesign,
					visible,
					prevDesignId,
					nextDesignId,
					nextVisibleDesignId,
					firstVisibleDesignId,
					orderedDesignIds,
				})

				return (
					<SidebarPanelRow key={fill.id}>
						<SidebarPanelReorderArtboardDesign
							id={id}
							artboardId={artboard.id}
							designCount={designCount}
							panelIndex={index}
							selectDesignIdOnMoveUp={selectDesignIdOnMoveUp}
							selectDesignIdOnMoveDown={selectDesignIdOnMoveDown}
						/>
						<SidebarPanelRowContainer>
							{/* values */}
							<SidebarPanelRowValuesContainer>
								<PanelPopoverDesignFill fill={fill} />
								{/* this is a little buggy, but I can manage for now */}
								{fill.style === 'none' ? (
									<SidebarPanelRowValuesDisabled value="No Fill" />
								) : fill.basis !== 'defined' ? (
									<SidebarPanelRowValuesDisabled value={fill.basis} />
								) : (
									<PanelFormDesignFillEditValue fill={fill} />
								)}
							</SidebarPanelRowValuesContainer>
							{/* actions */}
							<SidebarPanelActionsArtboardDesign
								id={id}
								artboardId={artboard.id}
								visible={visible}
								isSelectedDesign={isSelectedDesign}
								selectDesignIdOnToggleVisible={selectDesignIdOnToggleVisible}
								selectDesignIdOnDelete={selectDesignIdOnDelete}
							/>
						</SidebarPanelRowContainer>
					</SidebarPanelRow>
				)
			})}
		</SidebarPanel>
	)
}
