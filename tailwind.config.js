/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./*.html"],
    theme: {
        extend: {
            colors: {
                'tmm-navy': '#1B3A5F',
                'tmm-gold': '#B8935F',
                'tmm-navy-light': '#2C4F7C',
                'tmm-navy-dark': '#0F2438',
                'tmm-gold-light': '#D4B589',
                'tmm-gold-dark': '#9A7A4D',
            },
            fontFamily: {
                'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
                'heading': ['Poppins', 'Inter', 'sans-serif'],
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '128': '32rem',
            },
        },
    },
    plugins: [require("daisyui")],
    daisyui: {
        themes: [
            {
                tmm: {
                    "primary": "#1B3A5F",
                    "secondary": "#B8935F",
                    "accent": "#D4B589",
                    "neutral": "#2C4F7C",
                    "base-100": "#FFFFFF",
                    "info": "#3ABFF8",
                    "success": "#36D399",
                    "warning": "#FBBD23",
                    "error": "#F87272",
                },
            },
        ],
    },
}
