const CopyPlugin = require('copy-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

let devtool = 'source-map';
let sourceType = 'development';
if (process.env.NODE_ENV === 'production') {
    devtool = undefined;
    sourceType = 'production.min';
}

module.exports = {
    mode: sourceType,
    devtool: devtool,
    watchOptions: {
        followSymlinks: true
    },
    entry: {
        main: ['./src/main/main.ts', './src/main/ipc.ts']
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: 'src/icons/*' },
            ]
        }),
        new ESLintPlugin({
            extensions: ['.js', '.ts'],
            configType: 'flat',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.node$/,
                use: 'node-loader',
            },
            {
                test: /\.ts$/,
                exclude: /(node_modules|\.webpack)/,
                use: {
                    loader: 'ts-loader',
                }
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.ts']
    },
    target: 'electron-main',
    output: {
        hashFunction: 'xxhash64',
    }
};
