import { prisma } from '#app/utils/db.server'
import { type IDesign } from '../design/definitions'
import {
	IDesignUpdateAttributesParams,
	IDesignUpdateParams,
} from './definitions.update'
import {
	queryDesignWhereArgsType,
	validateQueryWhereArgsPresent,
} from './design.get.server'
import { stringifyDesignAttributes } from './utils'

type IDesignUpdateFields =
	| 'visible'
	| 'selected'
	| 'attributes'
	| 'nextId'
	| 'prevId'

export const updateDesignField = ({
	id,
	ownerId,
	data,
}: IDesignUpdateParams & {
	data: Pick<Partial<IDesign>, IDesignUpdateFields>
}) => {
	return prisma.design.update({
		where: { id, ownerId },
		data,
	})
}

export const updateDesignFields = ({
	where,
	data,
}: {
	where: queryDesignWhereArgsType
	data: Pick<Partial<IDesign>, IDesignUpdateFields>
}) => {
	validateQueryWhereArgsPresent(where)
	return prisma.design.updateMany({
		where,
		data,
	})
}

export const updateDesignAttributes = ({
	id,
	ownerId,
	type,
	attributes,
}: IDesignUpdateAttributesParams) => {
	const jsonAttributes = stringifyDesignAttributes({
		type,
		attributes,
	})
	const serializedData = { attributes: jsonAttributes }
	return updateDesignField({
		id,
		ownerId,
		data: serializedData,
	})
}

export const updateDesignVisible = ({
	id,
	ownerId,
	visible,
}: IDesignUpdateParams & { visible: boolean }) => {
	return updateDesignField({
		id,
		ownerId,
		data: { visible },
	})
}

export const updateDesignSelected = ({
	id,
	selected,
}: {
	id: IDesign['id']
	selected: boolean
}) => {
	return updateDesignFields({
		where: { id },
		data: { selected },
	})
}
