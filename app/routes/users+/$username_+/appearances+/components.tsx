import { type Appearance } from '@prisma/client'
import { Link, NavLink, useLoaderData } from '@remix-run/react'
import {
	BreadcrumbsContainer,
	SideNavHeaderImage,
	SideNavHeaderLink,
	SideNavHeaderTitle,
	SideNavList,
	SideNavListItem,
	sideNavLinkDefaultClassName,
} from '#app/components/shared'
import { useBreadcrumbs } from '#app/utils/breadcrumbs'
import { cn, getUserImgSrc } from '#app/utils/misc'
import { useUser } from '#app/utils/user'
import { type loader } from './route'

export const Header = () => {
	const data = useLoaderData<typeof loader>()
	const { owner } = data
	const ownerDisplayName = owner.name ?? owner.username
	const title = `${ownerDisplayName}'s Appearances`

	return (
		<SideNavHeaderLink to={`/users/${owner.username}`}>
			<SideNavHeaderImage
				src={getUserImgSrc(owner.image?.id)}
				alt={ownerDisplayName}
			/>
			<SideNavHeaderTitle>{title}</SideNavHeaderTitle>
		</SideNavHeaderLink>
	)
}

export const List = () => {
	const data = useLoaderData<typeof loader>()
	const { appearances } = data

	const ListItem = ({ appearance }: { appearance: Appearance }) => {
		const { slug, name } = appearance
		return (
			<SideNavListItem key={slug}>
				<NavLink
					to={slug}
					preventScrollReset
					prefetch="intent"
					className={({ isActive }) =>
						cn(sideNavLinkDefaultClassName, isActive && 'bg-accent')
					}
				>
					{name}
				</NavLink>
			</SideNavListItem>
		)
	}

	return (
		<SideNavList>
			{appearances.map(appearance => (
				<ListItem key={appearance.slug} appearance={appearance as Appearance} />
			))}
		</SideNavList>
	)
}

export const Breadcrumbs = () => {
	const user = useUser()
	const breadcrumbs = useBreadcrumbs()

	return (
		<BreadcrumbsContainer>
			<ul className="flex gap-3">
				<li>
					<Link
						className="text-muted-foreground"
						to={`/users/${user.username}`}
					>
						Profile
					</Link>
				</li>
				{breadcrumbs.map((breadcrumb, i, arr) => (
					<li
						key={i}
						className={cn('flex items-center gap-3', {
							'text-muted-foreground': i < arr.length - 1,
						})}
					>
						▶️ {breadcrumb}
					</li>
				))}
			</ul>
		</BreadcrumbsContainer>
	)
}