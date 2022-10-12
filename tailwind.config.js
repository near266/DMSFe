/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,ts}'],
    theme: {
        extend: {
            boxShadow: {
                'double-inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.25);',
            },
        },
    },
    plugins: [],
};
