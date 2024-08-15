import { type IArtworkVersion, type IArtworkVersionData } from './definitions'

export const getArtworkVersionData = ({
	artworkVersion,
}: {
	artworkVersion: IArtworkVersion
}): IArtworkVersionData => {
	return {
		name: artworkVersion.name,
		slug: artworkVersion.slug,
		description: artworkVersion.description,
		watermark: artworkVersion.watermark,
		watermarkColor: artworkVersion.watermarkColor,
		width: artworkVersion.width,
		height: artworkVersion.height,
		background: artworkVersion.background,
	}
}
