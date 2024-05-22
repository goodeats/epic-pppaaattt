import { vitePlugin as remix } from '@remix-run/dev'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import { glob } from 'glob'
import { remixDevTools } from 'remix-development-tools/vite'
import { flatRoutes } from 'remix-flat-routes'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

const MODE = process.env.NODE_ENV

export default defineConfig({
	plugins: [
		remixDevTools(),
		remix({
			ignoredRouteFiles: ['**/*'],
			serverModuleFormat: 'esm',
			future: { v3_fetcherPersist: true },
			routes: async defineRoutes => {
				return flatRoutes('routes', defineRoutes, {
					ignoredRouteFiles: [
						'.*',
						'**/*.css',
						'**/*.test.{js,jsx,ts,tsx}',
						'**/__*.*',
					],
				})
			},
		}),
		process.env.SENTRY_AUTH_TOKEN
			? sentryVitePlugin({
					disable: MODE !== 'production',
					authToken: process.env.SENTRY_AUTH_TOKEN,
					org: process.env.SENTRY_ORG,
					project: process.env.SENTRY_PROJECT,
					release: {
						name: process.env.COMMIT_SHA,
						setCommits: {
							auto: true,
						},
					},
					sourcemaps: {
						filesToDeleteAfterUpload: await glob([
							'./build/**/*.map',
							'.server-build/**/*.map',
						]),
					},
				})
			: null,
		tsconfigPaths(),
	],
})
