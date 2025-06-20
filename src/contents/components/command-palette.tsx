import { KBarAnimator, KBarPortal, KBarPositioner, KBarSearch } from "kbar";
import { useTheme } from "../hooks/use-theme";
import { Results } from "./render-results";

export function CommandPalette() {
	const { theme } = useTheme();

	return (
		<>
			<KBarPortal>
				<div className={`plasmo-portal ${theme}`}>
					<KBarPositioner className="fixed flex items-start justify-center w-full inset-0 pt-[14vh] px-4 pb-4 bg-background/60 box-border z-[9999]">
						<KBarAnimator className="max-w-[600px] w-full bg-popover text-popover-foreground rounded-lg overflow-hidden shadow-lg">
							<KBarSearch
								className="p-3 text-base w-full box-border outline-none border-none m-0 bg-popover text-popover-foreground border-b border-border/10"
								placeholder="Type a command or search..."
							/>
							<Results />
						</KBarAnimator>
					</KBarPositioner>
				</div>
			</KBarPortal>
		</>
	);
}
