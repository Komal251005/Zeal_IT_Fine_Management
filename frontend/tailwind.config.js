/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f0f5ff',
                    100: '#e0eaff',
                    200: '#c7d7fe',
                    300: '#a4bcfc',
                    400: '#7a9bf8',
                    500: '#5a7cf2',
                    600: '#3d5ce6',
                    700: '#1e3a5f',
                    800: '#1a3355',
                    900: '#162b4a',
                },
                secondary: {
                    50: '#ecfdf5',
                    100: '#d1fae5',
                    200: '#a7f3d0',
                    300: '#6ee7b7',
                    400: '#34d399',
                    500: '#10b981',
                    600: '#059669',
                    700: '#047857',
                    800: '#065f46',
                    900: '#064e3b',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
