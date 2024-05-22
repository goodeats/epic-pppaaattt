import { Link, useMatches } from '@remix-run/react'
import {
	DashboardContentHeading1,
	DashboardContentHeading2,
} from '#app/components/layout'
import { DashboardEntityCards } from '#app/components/templates'
import { useRouteLoaderMatchData } from '#app/utils/matches'
import { useUser } from '#app/utils/user'
import { projectLoaderRoute } from './route'

export default function SketchProjectIndexRoute() {
	const user = useUser()
	const matches = useMatches()
	const { project } = useRouteLoaderMatchData(matches, projectLoaderRoute)

	return (
		<div className="container">
			<DashboardContentHeading1>{project.name}</DashboardContentHeading1>
			<DashboardContentHeading2>
				<Link prefetch="intent" to="artboards">
					Artboards
				</Link>
			</DashboardContentHeading2>
			<DashboardEntityCards
				entities={project.artboards}
				type="Artboard"
				parent={project.name}
				basePathNew={`/users/${user.username}/projects/${project.slug}/artboards`}
				basePathEditor={`/users/${user.username}/artboards`}
				basePathView="artboards"
			/>
		</div>
	)
}
