import { type AllIntentValues } from '#app/constants/intent'
import { type IArtwork } from '#app/models/artwork/artwork.server'
import { type IArtworkBranch } from '#app/models/artwork-branch/_._definitions.js'
import { type IArtworkVersion } from '#app/models/artwork-version/definitions'
import { type designTypeEnum, type IDesign } from '#app/models/design/definitions'
import { type ILayer } from '#app/models/layer/definitions'
import { type IExampleEntity } from '#dev/model-file-structure/entity._._definitions.js'

export const HiddenInput = ({
	name,
	value,
}: {
	name: string
	value: string
}) => {
	return <input type="hidden" name={name} value={value} />
}

// frequenty used
export const IntentInput = ({ intent }: { intent: AllIntentValues }) => {
	return <HiddenInput name="intent" value={intent} />
}

export const NoJsInput = ({ value }: { value: string }) => {
	return <HiddenInput name="no-js" value={value} />
}

export const HiddenInputId = ({ id }: { id: IArtworkVersion['id'] }) => {
	return <HiddenInput name="id" value={id} />
}

export const HiddenInputExampleEntityId = ({ id }: { id: IExampleEntity['id'] }) => {
	return <HiddenInput name="exampleEntityId" value={id} />
}

// models

export const HiddenInputArtwork = ({ id }: { id: IArtwork['id'] }) => {
	return <HiddenInput name="artworkId" value={id} />
}

export const HiddenInputArtworkBranch = ({
	id,
}: {
	id: IArtworkBranch['id']
}) => {
	return <HiddenInput name="branchId" value={id} />
}

export const HiddenInputArtworkVersion = ({
	id,
}: {
	id: IArtworkVersion['id']
}) => {
	return <HiddenInput name="artworkVersionId" value={id} />
}

export const HiddenInputLayer = ({ id }: { id: ILayer['id'] }) => {
	return <HiddenInput name="layerId" value={id} />
}

export const HiddenInputDesign = ({ id }: { id: IDesign['id'] }) => {
	return <HiddenInput name="designId" value={id} />
}

export const HiddenInputDesignType = ({ type }: { type: designTypeEnum }) => {
	return <HiddenInput name="type" value={type} />
}
