import { invariantResponse } from '@epic-web/invariant'
import {
	json,
	type MetaFunction,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { DashboardBody, DashboardContent } from '#app/components/layout'
import { getProjectsWithArtboards } from '#app/models/project/project.get.server'
import { getUserBasic } from '#app/models/user/user.get.server'
import { requireUserId } from '#app/utils/auth.server'
import { ProjectCards } from './components/project-cards'

export async function loader({ params, request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const owner = await getUserBasic({ where: { id: userId } })
	invariantResponse(owner, 'Owner not found', { status: 404 })

	const projects = await getProjectsWithArtboards({
		where: { ownerId: userId },
	})
	return json({ projects })
}

export default function SketchIndexRoute() {
	const data = useLoaderData<typeof loader>()

	return (
		<DashboardBody id="sketch-dashboard-body">
			<DashboardContent id="sketch-dashboard-content">
				<div className="container">
					<h2 className="mb-2 pt-12 text-h2 lg:mb-6">Sketch Dashboard</h2>
				</div>
				<div className="container">
					<h3 className="mb-2 pt-12 text-h3 lg:mb-6">
						<Link to="projects">Projects</Link>
					</h3>
					<ProjectCards projects={data.projects} />
				</div>
			</DashboardContent>
		</DashboardBody>
	)
}

export const meta: MetaFunction = () => {
	return [
		{ title: 'Sketchy | XYZ' },
		{
			name: 'description',
			content: 'Sketchy dashboard for XYZ',
		},
	]
}