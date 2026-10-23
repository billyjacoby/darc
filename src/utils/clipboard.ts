// Synchronous, so the copy completes even when the palette window closes
// right after the action runs. navigator.clipboard is the fallback, since
// execCommand can be blocked on some pages.
export const copyText = (text: string) => {
	const textarea = document.createElement("textarea");
	textarea.value = text;
	textarea.setAttribute("readonly", "");
	textarea.style.position = "fixed";
	textarea.style.opacity = "0";
	document.body.appendChild(textarea);
	textarea.select();
	const copied = document.execCommand("copy");
	textarea.remove();

	if (!copied) {
		navigator.clipboard?.writeText(text).catch((error) => {
			console.error("Failed to copy:", error);
		});
	}
};
