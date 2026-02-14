import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			// Mobile-first breakpoints
			screens: {
				xs: "320px",
				sm: "375px",
				md: "428px",
				lg: "768px",
				xl: "1024px",
			},
			// Custom spacing for mobile touch targets (44px minimum)
			spacing: {
				touch: "44px",
			},
			// Animation durations matching requirements
			transitionDuration: {
				page: "300ms",
			},
			// Custom colors for the platform
			colors: {
				background: "var(--color-background)",
				foreground: "var(--color-foreground)",
			},
		},
	},
	plugins: [],
};

export default config;
