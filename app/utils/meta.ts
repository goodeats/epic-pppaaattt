import { invariant } from '@epic-web/invariant'
import { type SerializeFrom } from '@remix-run/node'
import { type MetaMatches } from '@remix-run/react/dist/routeModules'
import { type loader as rootLoader } from '#app/root.tsx'
import {
	type artboardstLoaderRoute,
	type loader as artboardsLoader,
} from '#app/routes/sketch+/projects+/$projectSlug_+/artboards+'
import {
	type artboardLoaderRoute,
	type loader as artboardLoader,
} from '#app/routes/sketch+/projects+/$projectSlug_+/artboards+/$artboardSlug_+/route'
import {
	type projectLoaderRoute,
	type loader as projectLoader,
} from '#app/routes/sketch+/projects+/$projectSlug_+/route'
import {
	type projectsLoaderRoute,
	type loader as projectsLoader,
} from '#app/routes/sketch+/projects+/route'

// ensure matches route loader data is available for meta
// https://github.com/remix-run/remix/issues/7347

interface RouteLoaders {
	root: typeof rootLoader
	[projectsLoaderRoute]: typeof projectsLoader
	[projectLoaderRoute]: typeof projectLoader
	[artboardstLoaderRoute]: typeof artboardsLoader
	[artboardLoaderRoute]: typeof artboardLoader
}

export function routeLoaderData<K extends keyof RouteLoaders>(
	matches: MetaMatches,
	matchId: K,
): SerializeFrom<RouteLoaders[K]> {
	const match = matches.find(({ id }) => id === matchId)
	invariant(match, 'Router loader data not found')
	return match.data as SerializeFrom<RouteLoaders[K]>
}
