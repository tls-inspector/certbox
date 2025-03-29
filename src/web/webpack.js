const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CspHtmlWebpackPlugin = require('csp-html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const { execSync } = require('child_process');

let devtool = 'source-map';
let sourceType = 'development';
if (process.env.NODE_ENV === 'production') {
    devtool = undefined;
    sourceType = 'production.min';
}
const production = process.env.NODE_ENV === 'production';
const cacheKey = process.env.CACHE_KEY || crypto.randomBytes(3).toString('hex');
const staticRoot = production ? (cacheKey + '/') : '';

const goroot = execSync('go env GOROOT').toString().trim();
const wasmExec = path.join(goroot, 'lib', 'wasm', 'wasm_exec.js');

function wasmSha() {
    const fileBuffer = fs.readFileSync(wasmExec);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    return "'sha256-" + hashSum.digest('base64') + "'";
}

module.exports = {
    mode: sourceType,
    devtool: devtool,
    entry: './src/index.tsx',
    resolve: {
        symlinks: false,
        extensions: ['.ts', '.tsx', '.js', '.html', '.json']
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/html/index.' + sourceType + '.html',
            base: production ? ('/' + staticRoot) : ''
        }),
        new CspHtmlWebpackPlugin({
            'script-src': ["'wasm-unsafe-eval'", wasmSha()]
        }),
        new CopyPlugin({
            patterns: [
                { from: 'src/icons/certbox.png', to: 'certbox.png' },
                { from: wasmExec, to: 'assets/js' },
                { from: '../certbox/cmd/certgen/certgen.wasm', to: 'wasm/certgen.wasm' },
            ]
        }),
        new ESLintPlugin({
            extensions: ['.ts', '.tsx', '.js', '.jsx'],
            configType: 'flat',
        }),
    ],
    target: 'web',
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader'
                    }
                ]
            },
            {
                test: /\.(woff|woff2)$/,
                type: 'asset/inline',
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader'
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ],
            },
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist', staticRoot),
        filename: 'app.js',
        hashFunction: 'xxhash64',
    },
};
