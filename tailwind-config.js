tailwind.config = {
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#05070A', 
          bgSecondary: '#0D1117',
          surface: '#161b22', 
          card: '#111827',
          textMain: '#FFFFFF',
          textSecondary: '#9CA3AF',
          primary: '#0097b2',
          secondary: '#fb9203',
          border: '#30363d' 
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'glow-pulse': 'glow 4s ease-in-out infinite',
        'glow-pulse-alt': 'glow-pulse-alt 4s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
        'reverse-spin-slow': 'reverse-spin 18s linear infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { opacity: 0.6, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.05)' },
        },
        'glow-pulse-alt': {
          '0%': { opacity: 0.3, transform: 'scale(1)' },
          '100%': { opacity: 0.7, transform: 'scale(1.2)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'reverse-spin': {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        }
      }
    }
  }
}
