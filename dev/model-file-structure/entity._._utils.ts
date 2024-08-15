import {
	type IExampleEntity,
	type IExampleEntityData,
} from './entity._._definitions'

export const getExampleEntityData = ({
	exampleEntity,
}: {
	exampleEntity: IExampleEntity
}): IExampleEntityData => {
	return {
		name: exampleEntity.name,
		description: exampleEntity.description,
		visible: exampleEntity.visible,
	}
}
