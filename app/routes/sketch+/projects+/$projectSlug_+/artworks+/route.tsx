import { invariantResponse } from '@epic-web/invariant'
import {
	json,
	type MetaFunction,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import { getProjectWithArtworks } from '#app/models/project/project.get.server'
import { getUserBasic } from '#app/models/user/user.get.server'
import { requireUserId } from '#app/utils/auth.server'
import { routeLoaderMetaData } from '#app/utils/matches'

export const projectLoaderRoute =
	'routes/sketch+/projects+/$projectSlug_+/route'
export async function loader({ params, request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const owner = await getUserBasic({ where: { id: userId } })
	invariantResponse(owner, 'Owner not found', { status: 404 })

	const { projectSlug } = params
	const project = await getProjectWithArtworks({
		where: { slug: projectSlug, ownerId: owner.id },
	})
	invariantResponse(project, 'Project not found', { status: 404 })

	return json({ project })
}

export default function SketchProjectArtworksRoute() {
	return <Outlet />
}

export const meta: MetaFunction<typeof loader> = ({ params, matches }) => {
	const projectData = routeLoaderMetaData(matches, projectLoaderRoute)
	const projectName = projectData?.project.name ?? params.slug
	return [
		{ title: `Artworks | ${projectName} | Sketch | XYZ` },
		{
			name: 'description',
			content: `Sketch dashboard for XYZ project artworks: ${projectName}`,
		},
	]
}