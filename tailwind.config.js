/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	darkMode: ["class", "class"],
	theme: {
		extend: {
			colors: {
				'lab-pink': '#ff71ce',
				'secondary': '#01cdfe',
				'accent-green': '#05ffa1',
				'pop-yellow': '#fffb96',
				'pop-purple': '#b967ff',
				'background-light': '#ffffff',
				'lab-green': '#0df20d',
				'noir-pink': '#ff2ec7',
				'lab-lime': '#9df425',
				'danger': '#ff3131',
				'background-dark': '#102210',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			fontFamily: {
				'display': ['Space Grotesk', 'sans-serif'],
				'handwritten': ['Permanent Marker', 'cursive']
			},
			borderRadius: {
				'none': '0',
				'sm': '0.125rem',
				'DEFAULT': '1.25rem',
				'lg': '1.75rem',
				'xl': '2.25rem',
				'2xl': '3rem',
				'3xl': '4rem',
				'full': '9999px',
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			boxShadow: {
				pop: '4px 4px 0px 0px #000000',
				'pop-hover': '8px 8px 0px 0px #000000',
				sticker: '0 4px 12px rgba(0,0,0,0.08)',
				neobrutal: '8px 8px 0px 0px rgba(0, 0, 0, 1)',
				'neobrutal-sm': '4px 4px 0px 0px rgba(0, 0, 0, 1)',
				'neobrutal-pink': '6px 6px 0px 0px #ff2ec7',
				'pop-lime': '12px 12px 0px 0px #05ffa1',
				'pop-pink': '8px 8px 0px 0px #ff71ce',
				'purple-heavy': '16px 16px 0px 0px #b967ff',
				'neon-pink': '8px 8px 0px 0px #ff71ce',
				'neobrutal-xl': '10px 10px 0px 0px #000000',
				'neobrutal-lime': '10px 10px 0px 0px #9df425',
				'chunky-purple': '12px 12px 0px 0px #b967ff',
				'pop-lg': '10px 10px 0px 0px #000000',
				'neon-green': '12px 12px 0px 0px #05ffa1',
				'brutal': '6px 6px 0px 0px #000000',
				'brutal-lg': '12px 12px 0px 0px #000000',
				'brutal-green': '8px 8px 0px 0px #05ffa1',
				'brutal-pink': '8px 8px 0px 0px #ff71ce',
				'brutal-blue': '8px 8px 0px 0px #01cdfe',
				'danger-glow': '0px 0px 20px rgba(255, 49, 49, 0.4), 8px 8px 0px 0px #000000',
				'pop-brutal': '8px 8px 0px 0px #000000',
				'neon-purple-lg': '0 0 25px rgba(185, 103, 255, 0.8)',
			}
		},
	},
	plugins: [require("tailwindcss-animate")],
}
