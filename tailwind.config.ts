import type { Config } from "tailwindcss";

export default {
	darkMode: "class",
	content: ["./**/*.tsx"],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			// Scale from --darc-font-size instead of rem, since rem in a content
			// script is relative to the host page's root font size
			fontSize: {
				xs: ["calc(var(--darc-font-size) * 0.75)", { lineHeight: "1.333" }],
				sm: ["calc(var(--darc-font-size) * 0.875)", { lineHeight: "1.429" }],
				base: ["var(--darc-font-size)", { lineHeight: "1.5" }],
				lg: ["calc(var(--darc-font-size) * 1.125)", { lineHeight: "1.556" }],
				xl: ["calc(var(--darc-font-size) * 1.25)", { lineHeight: "1.4" }],
				"2xl": ["calc(var(--darc-font-size) * 1.5)", { lineHeight: "1.333" }],
			},
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
			},
		},
	},
	plugins: [],
} satisfies Config;
