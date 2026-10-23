import {
	getListboxItemId,
	KBAR_LISTBOX,
	useKBar,
	useRegisterActions,
	VisualState,
} from "kbar";
import { SearchIcon } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDynamicActions } from "../hooks/use-dynamic-actions";

// Shared by the input and the ghost layer so the text lines up exactly
const TEXT_CLASSES = "text-base p-2 m-0";

/**
 * Search input with inline (ghost text) URL completion.
 *
 * Replaces kbar's KBarSearch, whose value lives in internal state that can't
 * be set from outside, which accepting a completion requires. Arrow/Enter
 * navigation still works because KBarResults listens on window.
 */
export function DynamicSearch() {
	const { query, actions, currentRootActionId, activeIndex, showing } = useKBar(
		(state) => ({
			actions: state.actions,
			currentRootActionId: state.currentRootActionId,
			activeIndex: state.activeIndex,
			showing: state.visualState === VisualState.showing,
		}),
	);

	const [inputValue, setInputValue] = useState("");
	const [caretAtEnd, setCaretAtEnd] = useState(true);
	const [overflowing, setOverflowing] = useState(false);
	const inputRef = useRef<HTMLInputElement | null>(null);

	const { actions: dynamicActions, completion } = useDynamicActions(inputValue);
	useRegisterActions(dynamicActions, [dynamicActions]);

	useEffect(() => {
		query.setSearch(inputValue);
	}, [inputValue, query]);

	// Mirror KBarSearch: reset the input when entering/leaving a nested action
	// biome-ignore lint/correctness/useExhaustiveDependencies: runs on root action change
	useEffect(() => {
		setInputValue("");
		query.getInput()?.focus();
		return () => query.setSearch("");
	}, [currentRootActionId, query]);

	// The ghost layer can't follow a horizontally scrolled input, so hide it then
	// biome-ignore lint/correctness/useExhaustiveDependencies: re-measure when the text changes
	useLayoutEffect(() => {
		const input = inputRef.current;
		setOverflowing(!!input && input.scrollWidth > input.clientWidth);
	}, [inputValue, completion]);

	const showGhost = !!completion && caretAtEnd && !overflowing;

	const syncCaret = () => {
		const input = inputRef.current;
		if (!input) return;
		setCaretAtEnd(
			input.selectionStart === input.value.length &&
				input.selectionEnd === input.value.length,
		);
	};

	const acceptCompletion = () => {
		setInputValue(inputValue + completion);
		setCaretAtEnd(true);
	};

	const placeholder =
		currentRootActionId && actions[currentRootActionId]
			? actions[currentRootActionId].name
			: "Search or enter a URL...";

	return (
		<div className="flex flex-row items-center p-4 gap-2">
			<SearchIcon className="w-6 h-6" />
			<div className="relative w-full">
				{showGhost && (
					<div
						aria-hidden
						className={`${TEXT_CLASSES} absolute inset-0 flex items-center pointer-events-none whitespace-pre overflow-hidden`}
					>
						<span className="invisible">{inputValue}</span>
						<span className="text-muted-foreground">{completion}</span>
					</div>
				)}
				<input
					ref={(element) => {
						inputRef.current = element;
						query.inputRefSetter(element);
					}}
					className={`${TEXT_CLASSES} relative w-full box-border outline-none border-none bg-transparent text-popover-foreground`}
					autoComplete="off"
					role="combobox"
					spellCheck="false"
					aria-expanded={showing}
					aria-controls={KBAR_LISTBOX}
					aria-activedescendant={getListboxItemId(activeIndex)}
					aria-autocomplete="both"
					value={inputValue}
					placeholder={placeholder}
					onChange={(event) => {
						setInputValue(event.target.value);
						syncCaret();
					}}
					// React's onSelect doesn't fire inside the content script's shadow
					// root, so re-check the caret after keys and clicks that can move it
					onSelect={syncCaret}
					onMouseUp={syncCaret}
					// Host pages can move focus programmatically; keep it here while the
					// palette is open (but not when the whole browser loses focus)
					onBlur={() => {
						if (!showing || !document.hasFocus()) return;
						requestAnimationFrame(() => inputRef.current?.focus());
					}}
					onKeyDown={(event) => {
						requestAnimationFrame(syncCaret);

						if (
							showGhost &&
							((event.key === "Tab" && !event.shiftKey) ||
								event.key === "ArrowRight")
						) {
							event.preventDefault();
							acceptCompletion();
							return;
						}

						if (
							currentRootActionId &&
							!inputValue &&
							event.key === "Backspace"
						) {
							query.setCurrentRootAction(actions[currentRootActionId].parent);
						}
					}}
				/>
			</div>
		</div>
	);
}
