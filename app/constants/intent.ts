// const intent = INTENT[entityType].CREATE[parentType];

import { type EntityCreateDialogIntentValues } from '#app/routes/resources+/api.v1+/entity.create.dialog'
import { type EntityCreateIconIntentValues } from '#app/routes/resources+/api.v1+/entity.create.icon'
import { type EntityToggleAttributeIntentValues } from '#app/routes/resources+/api.v1+/entity.toggle.attribute'
import { type ExtractStringValues } from '#app/utils/typescript-helpers'

export const INTENT = {
	DESIGN: {
		UPDATE: {
			REORDER: {
				ARTWORK_VERSION: {
					MOVE_DOWN: 'update-artwork-version-design-reorder-move-down',
					MOVE_UP: 'update-artwork-version-design-reorder-move-up',
				},
				LAYER: {
					MOVE_DOWN: 'update-layer-design-reorder-move-down',
					MOVE_UP: 'update-layer-design-reorder-move-up',
				},
			},
			TYPE: {
				ATTRIBUTE: {
					HEX: {
						FILL_VALUE: 'update-design-type-fill-value-hex',
					},
					SELECT: {
						FILL_BASIS: 'update-design-type-fill-basis-select',
						FILL_STYLE: 'update-design-type-fill-style-select',
					},
				},
			},
		},
		DELETE: {
			ARTWORK_VERSION: 'delete-artwork-version-design',
			LAYER: 'delete-layer-design',
		},
	},
	ASSET: {
		IMAGE: {
			CREATE: {
				ARTWORK: 'create-artwork-asset-image',
				ARTWORK_VERSION: 'create-artwork-version-asset-image',
				LAYER: 'create-layer-asset-image',
			},
		},
	},
	LAYER: {
		UPDATE: {
			REORDER: {
				ARTWORK_VERSION: {
					MOVE_DOWN: 'update-artwork-version-layer-reorder-move-down',
					MOVE_UP: 'update-artwork-version-layer-reorder-move-up',
				},
			},
		},
	},
	// Add more entities as needed
} as const

// Type to capture all possible values in INTENT
export type IntentValues = ExtractStringValues<typeof INTENT>
export type AllIntentValues =
	| IntentValues
	| EntityCreateIconIntentValues
	| EntityCreateDialogIntentValues
	| EntityToggleAttributeIntentValues

export const invalidIntentResponse = {
	status: 'error',
	submission: null,
	responseSuccess: false,
	message: 'Invalid intent',
} as const
