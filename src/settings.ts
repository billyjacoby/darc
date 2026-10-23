export const SETTINGS_KEYS = {
	FONT_SIZE: "font-size",
} as const;

// Base font size (px) for the command palette; Tailwind's text-* sizes scale from it
export const FONT_SIZE = {
	DEFAULT: 16,
	MIN: 12,
	MAX: 24,
} as const;
