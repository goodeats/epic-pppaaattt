import { type User } from '@prisma/client'
import {
	type IDesignEntityId,
	type IDesignCreateOverrides,
	type IDesignTypeCreateOverrides,
} from '#app/models/design.server'
import { type ILayer } from '#app/models/layer.server'
import {
	type designCloneSourceTypeEnum,
	type designTypeEnum,
} from '#app/schema/design'
import {
	cloneDesignsService,
	type ICloneDesignsStrategy,
} from '../../design/clone.service'
import { layerDesignCreateService } from '../../layer/design/create.service'

export class CloneDesignsToLayerStrategy implements ICloneDesignsStrategy {
	async createEntityDesignService({
		userId,
		targetEntityId,
		type,
		designOverrides,
		designTypeOverrides,
	}: {
		userId: User['id']
		targetEntityId: IDesignEntityId
		type: designTypeEnum
		designOverrides?: IDesignCreateOverrides
		designTypeOverrides?: IDesignTypeCreateOverrides
	}): Promise<void> {
		await layerDesignCreateService({
			userId,
			layerId: targetEntityId,
			type,
			designOverrides,
			designTypeOverrides,
		})
	}
}

export const artboardLayerCloneDesignsService = async ({
	userId,
	sourceEntityType,
	sourceEntityId,
	targetEntityId,
}: {
	userId: User['id']
	sourceEntityType: designCloneSourceTypeEnum
	sourceEntityId: IDesignEntityId
	targetEntityId: ILayer['id']
}) => {
	try {
		const entityStrategy = new CloneDesignsToLayerStrategy()

		await cloneDesignsService({
			userId,
			sourceEntityType,
			sourceEntityId,
			targetEntityId,
			entityStrategy,
		})
	} catch (error) {
		console.log(error)
		return { error: true }
	}
}