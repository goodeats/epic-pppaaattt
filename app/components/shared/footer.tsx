import { Link } from '@remix-run/react'
import { floatingToolbarClassName } from '../floating-toolbar'
import { Button } from '../ui/button'
import { Icon } from '../ui/icon'

const FooterContainer = ({ children }: { children: React.ReactNode }) => {
	return <div className={floatingToolbarClassName}>{children}</div>
}

const FooterTimestamp = ({ children }: { children: React.ReactNode }) => {
	return (
		<span className="text-sm text-foreground/90 max-[524px]:hidden">
			<Icon name="clock" className="scale-125">
				{children}
			</Icon>
		</span>
	)
}

const FooterActions = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="grid flex-1 grid-cols-2 justify-end gap-2 min-[525px]:flex md:gap-4">
			{children}
		</div>
	)
}

const FooterLinkButton = ({
	to,
	icon,
	children,
}: {
	to: string
	icon: 'pencil-1' | 'trash'
	children: React.ReactNode
}) => {
	return (
		<Button
			asChild
			className="min-[525px]:max-md:aspect-square min-[525px]:max-md:px-0"
		>
			<Link to={to}>
				<Icon name={icon} className="scale-125 max-md:scale-150">
					<span className="max-md:hidden">{children}</span>
				</Icon>
			</Link>
		</Button>
	)
}

export { FooterContainer, FooterTimestamp, FooterActions, FooterLinkButton }
