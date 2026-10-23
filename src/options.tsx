import "~utils/disable-logs";
import "~style.css";

import { useStorage } from "@plasmohq/storage/hook";
import { useId } from "react";
import { FONT_SIZE, SETTINGS_KEYS } from "~settings";

function Options() {
	const fontSizeId = useId();
	const [theme] = useStorage<string>("theme", "dark");
	const [fontSize, setFontSize] = useStorage<number>(
		SETTINGS_KEYS.FONT_SIZE,
		FONT_SIZE.DEFAULT,
	);

	return (
		<div
			className={`darc-settings ${theme} min-h-screen bg-background text-foreground font-sans`}
		>
			<main className="max-w-xl mx-auto px-6 py-10 flex flex-col gap-8">
				<h1 className="text-2xl font-semibold">dArc Settings</h1>

				<section className="flex flex-col gap-3">
					<div className="flex items-center justify-between">
						<label htmlFor={fontSizeId} className="font-medium">
							Font size
						</label>
						<span className="text-muted-foreground tabular-nums">
							{fontSize}px
						</span>
					</div>
					<input
						id={fontSizeId}
						type="range"
						min={FONT_SIZE.MIN}
						max={FONT_SIZE.MAX}
						step={1}
						value={fontSize}
						onChange={(e) => setFontSize(Number(e.target.value))}
					/>
					<button
						type="button"
						className="self-start text-sm text-muted-foreground underline disabled:opacity-50 disabled:no-underline"
						disabled={fontSize === FONT_SIZE.DEFAULT}
						onClick={() => setFontSize(FONT_SIZE.DEFAULT)}
					>
						Reset to default
					</button>

					{/* Mirrors a palette result row so the size can be judged before opening it */}
					<div
						className="rounded-2xl border-2 border-foreground/50 bg-popover text-popover-foreground overflow-hidden"
						style={
							{ "--darc-font-size": `${fontSize}px` } as React.CSSProperties
						}
					>
						<div className="p-4 text-base border-b border-border">
							Search or enter a URL...
						</div>
						<div className="px-4 py-3 bg-accent text-accent-foreground flex flex-col gap-1">
							<span className="text-sm">Example result</span>
							<span className="text-xs text-muted-foreground">
								https://example.com
							</span>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}

export default Options;
