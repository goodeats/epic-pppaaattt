import { type IEntityParentType, type IEntityType } from '#app/schema/entity'
import { type IDashboardPanelCreateEntityStrategy } from '#app/strategies/component/dashboard-panel/create-entity.strategy'
import { capitalize } from '#app/utils/string-formatting'
import { SidebarPanelHeader, SidebarPanelRowActionsContainer } from '..'
import { FormFetcherIcon } from '../form/fetcher/icon'

export const PanelEntityHeader = ({
	type,
	parent,
	strategyEntityNew,
}: {
	type: IEntityType
	parent: IEntityParentType
	strategyEntityNew: IDashboardPanelCreateEntityStrategy
}) => {
	return (
		<SidebarPanelHeader title={capitalize(type)}>
			<SidebarPanelRowActionsContainer>
				<FormFetcherIcon
					type={type}
					parentTypeId={strategyEntityNew.parentTypeId}
					parentId={parent.id}
					route={strategyEntityNew.route}
					formId={strategyEntityNew.formId}
					schema={strategyEntityNew.schema}
					icon="plus"
					iconText={strategyEntityNew.iconText}
				/>
			</SidebarPanelRowActionsContainer>
		</SidebarPanelHeader>
	)
}