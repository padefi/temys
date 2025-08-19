export default {
    plugins: {
        "@tailwindcss/postcss": {
            keyframes: {
                "blink-caret": {
                    "0%, 100%": { opacity: "0" },
                    "50%": { opacity: "1" },
                },
            },
            "blink-caret": {
                "0%, 100%": { opacity: "0" },
                "50%": { opacity: "1" },
            },
        },
    },
};
