// Define an enum for appearance types
export enum AppearanceType {
	LineWidth = 'line-width',
	Size = 'size',
	// Add other appearance types here
}

// Define a type for mapping each appearance type to its slug, type name, and HTML canvas attribute
export type AppearanceMapping = {
	[key in AppearanceType]: {
		slug: string
		typeName: string
	}
}

// Define and export the mapping
export const appearanceMapping: AppearanceMapping = {
	[AppearanceType.LineWidth]: {
		slug: 'line-width',
		typeName: 'LineWidth',
	},
	[AppearanceType.Size]: {
		slug: 'size',
		typeName: 'Size',
	},
	// Add other mappings here
}

export function findAppearanceTypeBySlug(slug: string): AppearanceType | null {
	return Object.values(AppearanceType).includes(slug as AppearanceType)
		? (slug as AppearanceType)
		: null
}
