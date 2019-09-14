module.exports = {
    root: true,
    env: {
        browser: true,
        node: true
    },
    extends: [
        'eslint:recommended',
        '.eslintrc-base.js',
        '.eslintrc-es6plus.js'
    ]
};
