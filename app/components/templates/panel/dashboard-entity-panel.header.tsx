import { memo, useCallback } from 'react'
import {
	EntityParentType,
	type entityParentTypeEnum,
	type entityTypeEnum,
	type IEntityParentType,
	type IEntityType,
} from '#app/schema/entity'
import { type IDashboardPanelCreateEntityStrategy } from '#app/strategies/component/dashboard-panel/create-entity.strategy'
import { capitalize } from '#app/utils/string-formatting'
import { SidebarPanelHeader, SidebarPanelRowActionsContainer } from '..'
import { ArtworkVersionCreateChildEntityForm } from '#app/models/artwork-version/__components/create.child-entity.form'
import { LayerCreateChildEntityForm } from '#app/models/layer/__components.create.child-entity.form'

// the create forms ultimately lead to resource routes with fetchers and actions
// this causes unnecessary rerenders
// enter useCallback and memo
// the create forms are now memoized and only rerendered when the parent type or entity type changes (shouldn't happen)
// this also helps with readability and maintainability when more create forms are added

export interface CreateChildEntityFormProps {
	entityType: entityTypeEnum
	parentType?: entityParentTypeEnum
	type?: IEntityType
	parent: IEntityParentType
}

const CreateEntityForm = memo(
	({ parentType, entityType, type, parent }: CreateChildEntityFormProps) => {
		switch (parentType) {
			case EntityParentType.ARTWORK_VERSION:
				return (
					<ArtworkVersionCreateChildEntityForm
						entityType={entityType}
						type={type}
						parent={parent}
					/>
				)
			case EntityParentType.LAYER:
				return (
					<LayerCreateChildEntityForm
						entityType={entityType}
						type={type}
						parent={parent}
					/>
				)
			default:
				console.log('unknown parent type', parentType)
				return null
		}
	},
)
CreateEntityForm.displayName = 'CreateEntityForm'

export const PanelEntityHeader = ({
	type,
	parent,
	strategyEntityNew,
}: {
	type: IEntityType
	parent: IEntityParentType
	strategyEntityNew: IDashboardPanelCreateEntityStrategy
}) => {
	const { entityType, parentType } = strategyEntityNew

	const createEntityForm = useCallback(
		() => (
			<CreateEntityForm
				parentType={parentType}
				entityType={entityType}
				type={type}
				parent={parent}
			/>
		),
		[parentType, entityType, type, parent],
	)

	return (
		<SidebarPanelHeader title={capitalize(type)}>
			<SidebarPanelRowActionsContainer>
				{createEntityForm()}
			</SidebarPanelRowActionsContainer>
		</SidebarPanelHeader>
	)
}
