import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '1rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				// Brand core - Commissioner theme
				ink: 'hsl(var(--ink))',
				cream: 'hsl(var(--cream))',
				stripe: 'hsl(var(--stripe))',
				whistle: {
					light: 'hsl(var(--whistle-light))',
					mid: 'hsl(var(--whistle-mid))',
					dark: 'hsl(var(--whistle-dark))',
				},
				// Accents (scoreboard vibe)
				sport: {
					red: 'hsl(var(--sport-red))',
					green: 'hsl(var(--sport-green))',
					blue: 'hsl(var(--sport-blue))',
					amber: 'hsl(var(--sport-amber))',
				},
				// Secondary tones
				turf: 'hsl(var(--turf))',
				chalk: 'hsl(var(--chalk))',
				panel: 'hsl(var(--panel))',
				panelLt: 'hsl(var(--panel-light))',
				
				// Legacy shadcn compatibility
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				}
			},
			fontFamily: {
				display: ['Inter', 'system-ui', 'sans-serif'],
				body: ['Inter', 'system-ui', 'sans-serif'],
			},
			fontWeight: {
				black: '900',
				extrabold: '800',
				bold: '700',
				semibold: '600',
				medium: '500',
				normal: '400',
			},
			borderRadius: {
				card: '12px',
				pill: '9999px',
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			boxShadow: {
				card: '0 2px 0 0 rgba(0,0,0,0.55), 0 10px 24px rgba(0,0,0,0.25)',
				insetStrong: 'inset 0 -2px 0 rgba(0,0,0,0.25)',
				focusRing: '0 0 0 3px rgba(37,99,235,0.35)',
			},
			spacing: {
				'1.5': '0.375rem',
				'4.5': '1.125rem',
			},
			screens: {
				xs: '360px',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
