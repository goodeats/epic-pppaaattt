import {
	type ILayerWithDesigns,
	type ILayer,
	type ILayerWithChildren,
} from '#app/models/layer/definitions'

type FilteredLayer = ILayer | ILayerWithDesigns | ILayerWithChildren

export const filterLayersVisible = ({
	layers,
}: {
	layers: FilteredLayer[]
}): FilteredLayer[] => {
	return layers.filter(layer => layer.visible)
}
