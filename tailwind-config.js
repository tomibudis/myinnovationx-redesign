// Tailwind CSS Configuration for MyInnovationX
tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#ff6b6b',
                secondary: '#4ecdc4',
                accent: '#45b7d1',
                success: '#96ceb4',
                warning: '#feca57',
            },
            fontFamily: {
                'inter': ['Inter', 'sans-serif'],
            },
            animation: {
                'float': 'float 20s ease-in-out infinite',
                'fadeInUp': 'fadeInUp 1s ease-out',
                'bounce-slow': 'bounce 2s infinite',
                'pulse-slow': 'pulse 3s infinite',
                'shimmer': 'shimmer 2s infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                    '50%': { transform: 'translateY(-20px) rotate(1deg)' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(60px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                shimmer: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' },
                }
            },
            backdropBlur: {
                'xs': '2px',
            }
        }
    }
}
