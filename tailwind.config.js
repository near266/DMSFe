/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,ts}'],
    theme: {
        extend: {
            boxShadow: {
                'double-inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.25);',
            },
            aspectRatio: {
                '4/3': '4 / 3',
                '4/1': '4 / 1',
                '3/4': '3 / 4',
                '2/3': '2 / 3',
                '3/2': '3 / 2',
                '2/1': '2 / 1',
                '1/2': '1 / 2',
                '3/1': '3 / 1',
                '1/3': '1 / 3',
            },
            colors: {
                'green-text': '#04d7a2',
                'blue-text': '#1d214e',
            },
            gridTemplateColumns: {
                12: 'repeat(12, minmax(0, 1fr))',
                18: 'repeat(18, minmax(0, 1fr))',
            },
        },
    },
    plugins: [require('@tailwindcss/line-clamp')],
};
