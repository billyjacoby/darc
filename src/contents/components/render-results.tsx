import { KBarResults, useMatches } from "kbar";

export function Results() {
	const { results } = useMatches();

	return (
		<KBarResults
			items={results}
			onRender={({ item, active }) =>
				typeof item === "string" ? (
					<div className="px-4 py-2 text-xs text-muted-foreground uppercase tracking-wider">
						{item}
					</div>
				) : (
					<div
						className={`px-4 py-3 flex items-center justify-between cursor-pointer gap-2 ${
							active
								? "bg-accent text-accent-foreground"
								: "text-popover-foreground"
						}`}
					>
						<div className="flex items-center gap-3 flex-1 min-w-0">
							{item.icon && (
								<div className="flex-shrink-0">
									{typeof item.icon === "string" ? (
										<span className="text-base">{item.icon}</span>
									) : (
										item.icon
									)}
								</div>
							)}
							<div className="flex flex-col gap-1 min-w-0 flex-1">
								<span className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">
									{item.name}
								</span>
								{item.subtitle && (
									<span className="text-xs text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">
										{item.subtitle}
									</span>
								)}
							</div>
						</div>
						{item.shortcut?.length ? (
							<span className="grid grid-flow-col gap-1 flex-shrink-0">
								{item.shortcut.map((sc) => (
									<kbd
										key={sc}
										className="px-1.5 py-0.5 bg-muted text-muted-foreground rounded text-xs font-normal font-system"
									>
										{sc}
									</kbd>
								))}
							</span>
						) : null}
					</div>
				)
			}
		/>
	);
}
