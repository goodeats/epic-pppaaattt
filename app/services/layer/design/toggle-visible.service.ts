import { type User } from '@prisma/client'
import {
	type IDesign,
	type IDesignIdOrNull,
} from '#app/models/design/design.server'
import { type ILayer } from '#app/models/layer/layer.server'
import { LayerUpdateSelectedDesignStrategy } from '#app/strategies/design/update-selected.strategy'
import { designToggleVisibleService } from '../../design/toggle-visible.service'

export const layerDesignToggleVisibleService = async ({
	userId,
	id,
	layerId,
	updateSelectedDesignId,
}: {
	userId: User['id']
	id: IDesign['id']
	layerId: ILayer['id']
	updateSelectedDesignId?: IDesignIdOrNull
}) => {
	try {
		const updateSelectedDesignStrategy = new LayerUpdateSelectedDesignStrategy()
		return designToggleVisibleService({
			userId,
			id,
			targetEntityId: layerId,
			updateSelectedDesignId,
			updateSelectedDesignStrategy,
		})
	} catch (error) {
		console.log('layerDesignToggleVisibleService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}
