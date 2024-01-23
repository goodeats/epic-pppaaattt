import { floatingToolbarClassName } from '../floating-toolbar'
import { Icon } from '../ui/icon'

const FormContainer = ({ children }: { children: React.ReactNode }) => {
	return <div className="absolute inset-0">{children}</div>
}

const formDefaultClassName =
	'flex h-full flex-col gap-y-4 overflow-y-auto overflow-x-hidden px-10 pb-28 pt-12'

const FormFieldsContainer = ({ children }: { children: React.ReactNode }) => {
	return <div className="flex flex-col gap-1">{children}</div>
}

const FormActionsContainer = ({ children }: { children: React.ReactNode }) => {
	return <div className={floatingToolbarClassName}>{children}</div>
}

const FormDeleteIcon = () => {
	return (
		<Icon name="trash" className="scale-125 max-md:scale-150">
			<span className="max-md:hidden">Delete</span>
		</Icon>
	)
}

const formDeleteButtonDefaultClassName =
	'w-full max-md:aspect-square max-md:px-0'

export {
	FormContainer,
	FormFieldsContainer,
	FormActionsContainer,
	FormDeleteIcon,
	formDefaultClassName,
	formDeleteButtonDefaultClassName,
}
