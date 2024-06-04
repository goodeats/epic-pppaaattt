import { memo, useEffect, useRef, useState } from 'react'
import { useHydrated } from 'remix-utils/use-hydrated'
import { PanelIconButton } from '#app/components/ui/panel-icon-button'
import { type IArtworkVersionGenerator } from '#app/definitions/artwork-generator'
import { canvasDrawService } from '#app/services/canvas/draw.service'
import { TooltipHydrated } from '../tooltip'

// The ArtworkCanvas component is wrapped in React.memo to optimize performance by memoizing the component.
// This prevents unnecessary re-renders when the props passed to the component have not changed.
// Specifically, since this component involves canvas drawing operations which can be computationally expensive,
// memoizing ensures that these operations are only re-executed when necessary, such as when the 'generator' prop changes.
export const ArtworkCanvas = memo(
	({ generator }: { generator: IArtworkVersionGenerator }) => {
		const { width, height, background } = generator.settings
		const canvasRef = useRef<HTMLCanvasElement>(null)
		const [refresh, setRefresh] = useState(0)
		let isHydrated = useHydrated()

		useEffect(() => {
			const canvas = canvasRef.current
			if (canvas) {
				canvasDrawService({ canvas, generator })
			}
		}, [canvasRef, generator, refresh])

		const handleRefresh = () => {
			setRefresh(prev => prev + 1)
		}

		return (
			<div className="relative h-full w-full">
				<canvas
					id="canvas-editor"
					ref={canvasRef}
					width={width}
					height={height}
					style={{ backgroundColor: `#${background}` }}
					className="h-full w-full"
				/>
				<div className="mt-2">
					<TooltipHydrated tooltipText="Reload" isHydrated={isHydrated}>
						<PanelIconButton
							iconName="reload"
							iconText="Reload"
							onClick={handleRefresh}
						/>
					</TooltipHydrated>
				</div>
			</div>
		)
	},
)
ArtworkCanvas.displayName = 'ArtworkCanvas'
