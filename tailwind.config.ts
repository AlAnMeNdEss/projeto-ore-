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
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
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
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Cores específicas do sistema de oração
				prayer: {
					primary: 'hsl(var(--prayer-primary))',
					secondary: 'hsl(var(--prayer-secondary))',
					accent: 'hsl(var(--prayer-accent))',
					success: 'hsl(var(--prayer-success))',
					muted: 'hsl(var(--prayer-muted))'
				},
				// Cores mobile modernas
				mobile: {
					primary: 'hsl(var(--mobile-primary))',
					secondary: 'hsl(var(--mobile-secondary))',
					accent: 'hsl(var(--mobile-accent))',
					success: 'hsl(var(--mobile-success))',
					warning: 'hsl(var(--mobile-warning))',
					error: 'hsl(var(--mobile-error))',
					surface: 'hsl(var(--mobile-surface))',
					'surface-variant': 'hsl(var(--mobile-surface-variant))',
					'on-surface': 'hsl(var(--mobile-on-surface))',
					'on-surface-variant': 'hsl(var(--mobile-on-surface-variant))'
				}
			},
			backgroundImage: {
				'gradient-prayer': 'var(--gradient-prayer)',
				'gradient-peace': 'var(--gradient-peace)',
				'gradient-hope': 'var(--gradient-hope)',
				'gradient-spiritual': 'var(--gradient-spiritual)',
				'spiritual': 'var(--bg-spiritual)'
			},
			boxShadow: {
				'soft': 'var(--shadow-soft)',
				'prayer': 'var(--shadow-prayer)',
				'gentle': 'var(--shadow-gentle)',
				'mobile': '0 4px 20px rgba(0, 0, 0, 0.1)',
				'mobile-lg': '0 8px 32px rgba(0, 0, 0, 0.15)',
				'mobile-xl': '0 12px 48px rgba(0, 0, 0, 0.2)'
			},
			transitionTimingFunction: {
				'gentle': 'var(--transition-gentle)',
				'mobile': 'cubic-bezier(0.4, 0, 0.2, 1)'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				'mobile': '1rem',
				'mobile-lg': '1.5rem',
				'mobile-xl': '2rem'
			},
			spacing: {
				'mobile': '1rem',
				'mobile-lg': '1.5rem',
				'mobile-xl': '2rem'
			},
			fontSize: {
				'mobile-xs': ['0.75rem', { lineHeight: '1rem' }],
				'mobile-sm': ['0.875rem', { lineHeight: '1.25rem' }],
				'mobile-base': ['1rem', { lineHeight: '1.5rem' }],
				'mobile-lg': ['1.125rem', { lineHeight: '1.75rem' }],
				'mobile-xl': ['1.25rem', { lineHeight: '1.75rem' }],
				'mobile-2xl': ['1.5rem', { lineHeight: '2rem' }],
				'mobile-3xl': ['1.875rem', { lineHeight: '2.25rem' }],
				'mobile-4xl': ['2.25rem', { lineHeight: '2.5rem' }]
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
				},
				'bounce-in': {
					'0%': {
						transform: 'scale(0.3)',
						opacity: '0'
					},
					'50%': {
						transform: 'scale(1.05)'
					},
					'70%': {
						transform: 'scale(0.9)'
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '1'
					}
				},
				'ripple': {
					'0%': {
						transform: 'scale(0)',
						opacity: '1'
					},
					'100%': {
						transform: 'scale(4)',
						opacity: '0'
					}
				},
				'slide-up': {
					from: {
						transform: 'translateY(100%)'
					},
					to: {
						transform: 'translateY(0)'
					}
				},
				'slide-down': {
					from: {
						transform: 'translateY(-100%)',
						opacity: '0'
					},
					to: {
						transform: 'translateY(0)',
						opacity: '1'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'bounce-in': 'bounce-in 0.6s ease-out',
				'ripple': 'ripple 0.6s ease-out',
				'slide-up': 'slide-up 0.4s ease-out',
				'slide-down': 'slide-down 0.3s ease-out'
			},
			screens: {
				'mobile': '320px',
				'mobile-lg': '375px',
				'mobile-xl': '414px',
				'tablet': '768px',
				'laptop': '1024px',
				'desktop': '1280px'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
