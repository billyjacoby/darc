import { KBarAnimator, KBarPortal, KBarPositioner } from "kbar";
import { useTheme } from "../hooks/use-theme";
import { DynamicSearch } from "./dynamic-search";
import { Results } from "./render-results";

export function CommandPalette({
	containerRef,
}: {
	containerRef: React.RefObject<HTMLDivElement>;
}) {
	const { theme } = useTheme();

	return (
		<>
			<KBarPortal container={containerRef.current}>
				<div className={`plasmo-portal ${theme}`}>
					<KBarPositioner className="fixed flex items-start justify-center w-full inset-0 pt-[14vh] px-4 pb-4 bg-background/60 box-border z-[9999]">
						<KBarAnimator className="max-w-[600px] w-full bg-popover text-popover-foreground rounded-lg overflow-hidden shadow-lg">
							<DynamicSearch />
							<Results />
						</KBarAnimator>
					</KBarPositioner>
				</div>
			</KBarPortal>
		</>
	);
}
