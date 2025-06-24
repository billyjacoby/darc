import { KBarAnimator, KBarPortal, KBarPositioner } from "kbar";
import { useEffect } from "react";
import { useTheme } from "../hooks/use-theme";
import { DynamicSearch } from "./dynamic-search";
import { Results } from "./render-results";

export function CommandPalette({
	containerRef,
}: {
	containerRef: React.RefObject<HTMLDivElement>;
}) {
	const { theme } = useTheme();

	useEffect(() => {
		console.log("theme", theme);
	}, [theme]);

	return (
		<>
			<KBarPortal container={containerRef.current}>
				<div className={`plasmo-portal ${theme}`}>
					<KBarPositioner className="fixed flex items-start justify-center w-full inset-0 pt-[14vh] px-4 pb-4 backdrop-blur-sm bg-background/20 box-border z-[9999]">
						<KBarAnimator className="max-w-[800px] w-full bg-popover text-popover-foreground rounded-2xl overflow-hidden border-2 border-foreground/50">
							<DynamicSearch />
							<Results />
						</KBarAnimator>
					</KBarPositioner>
				</div>
			</KBarPortal>
		</>
	);
}
