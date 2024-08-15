import { vitePlugin as remix } from '@remix-run/dev'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import { glob } from 'glob'
import { remixDevTools } from 'remix-development-tools'
import { flatRoutes } from 'remix-flat-routes'
import { defineConfig } from 'vite'
import { denyImports, envOnlyMacros } from 'vite-env-only'
import tsconfigPaths from 'vite-tsconfig-paths'

const MODE = process.env.NODE_ENV

export default defineConfig({
	plugins: [
		remixDevTools({}),
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
		denyImports({
			client: {
				// need to load a File for FileSchema
				// server files get ReferenceError: File is not defined
				// node-fetch has a great polyfill for File
				// denying the node_modules importer is my limit for now
				// /^node:/, is back to being allowed
				// will come back to this later
				// this package is a cool idea though
				// specifiers: ['fs-extra', /^node:/, '@prisma/*'],
				// prisma too...
				// Error: [vite-env-only] Import denied
				// - Denied by specifier pattern: @prisma/*
				// - Importer: index.html
				// - Import: "@prisma/client"
				// - Environment: client
				// specifiers: ['fs-extra', '@prisma/*'],
				specifiers: ['fs-extra'],
				files: ['**/.server/*', '**/*.server.*'],
			},
			server: {
				specifiers: ['jquery'],
			},
		}),
		envOnlyMacros(),
		tsconfigPaths(),
	],
})
