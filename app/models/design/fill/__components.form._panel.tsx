import { memo, useCallback } from 'react'
import { SidebarPanelPopoverFormContainer } from '#app/components/layout/popover'
import { type IDesignFill } from '#app/models/design/fill/definitions'
import { type IEntity } from '#app/schema/entity'
import { FillBasisTypeEnum, FillStyleTypeEnum } from '#app/schema/fill'
import { UpdateDesignFillValueForm } from '#app/models/design/fill/__components.form.value'
import { UpdateDesignFillBasisForm } from '#app/models/design/fill/__components.form.basis'
import { UpdateDesignFillStyleForm } from '#app/models/design/fill/__components.form.style'
import { PanelEntityPopover } from '#app/components/templates/panel/dashboard-entity-panel.popover'
import { SidebarPanelRowValuesContainer } from '#app/components/templates'

export interface IDesignFillFormProps {
	fill: IDesignFill
	formIdsuffix?: string
}

const EntityPopover = memo(({ fill }: IDesignFillFormProps) => {
	// display color on popover trigger if fill is defined and solid
	const { basis, value } = fill.attributes
	const displayColor =
		basis === FillBasisTypeEnum.DEFINED && FillStyleTypeEnum.SOLID
	const backgroundColor = displayColor ? value : undefined

	return (
		<PanelEntityPopover name="Fill" backgroundColor={backgroundColor}>
			<SidebarPanelPopoverFormContainer>
				<span>Value</span>
				<UpdateDesignFillValueForm fill={fill} formIdsuffix="popover" />
			</SidebarPanelPopoverFormContainer>
			<SidebarPanelPopoverFormContainer>
				<span>Basis</span>
				<UpdateDesignFillBasisForm fill={fill} formIdsuffix="popover" />
			</SidebarPanelPopoverFormContainer>
			<SidebarPanelPopoverFormContainer>
				<span>Style</span>
				<UpdateDesignFillStyleForm fill={fill} formIdsuffix="popover" />
			</SidebarPanelPopoverFormContainer>
		</PanelEntityPopover>
	)
})
EntityPopover.displayName = 'EntityPopover'

const EntityMainForm = memo(({ fill }: IDesignFillFormProps) => {
	const { basis, style } = fill.attributes

	return style === FillStyleTypeEnum.NONE ? (
		<UpdateDesignFillStyleForm fill={fill} />
	) : basis !== FillBasisTypeEnum.DEFINED ? (
		<UpdateDesignFillBasisForm fill={fill} />
	) : (
		<UpdateDesignFillValueForm fill={fill} />
	)
})
EntityMainForm.displayName = 'EntityMainForm'

export const PanelFormsDesignFill = ({ entity }: { entity: IEntity }) => {
	const entityPopover = useCallback(
		() => <EntityPopover fill={entity as IDesignFill} />,
		[entity],
	)

	const entityMainForm = useCallback(
		() => <EntityMainForm fill={entity as IDesignFill} />,
		[entity],
	)

	return (
		<SidebarPanelRowValuesContainer>
			{entityPopover()}
			{entityMainForm()}
		</SidebarPanelRowValuesContainer>
	)
}
