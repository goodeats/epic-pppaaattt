import { type IArtworkVersionWithChildren } from '#app/models/artwork-version/definitions'

export const getArtworkVersionContainer = ({
	version,
}: {
	version: IArtworkVersionWithChildren
}) => {
	const { width, height } = version
	return {
		width,
		height,
		top: 0,
		left: 0,
		margin: 0,
		canvas: {
			width,
			height,
		},
	}
}
