import { defineConfig } from '@rspack/cli';
import path from 'path';

export default defineConfig({
    mode: 'development',
    devtool: 'source-map',
    context: path.resolve(__dirname, 'src'),
    entry: {
        'main': './main.tsx',
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js',
    },
    optimization: {
        minimize: false,
        chunkIds: 'deterministic',
        mergeDuplicateChunks: true,
    },
    resolve: {
        extensions: ['.ts', '.js', '.tsx', '.jsx'],
        tsConfigPath: path.resolve(__dirname, 'tsconfig.json'),
    },
    watchOptions: {
        ignored: /node_modules/,
        followSymlinks: true,
    },
    module: {
        rules: [
            {
                exclude: /node_modules/,
                oneOf: [
                    {
                        test: /\.(t|j)sx?$/,
                        exclude: /node_modules/,
                        use: {
                            loader: 'builtin:swc-loader',
                            options: {
                                jsc: {
                                    parser: {
                                        syntax: 'typescript',
                                        jsx: 'react-jsx',
                                    },
                                },
                            },
                        },
                    },
                ],
            },
        ],
    },
    devServer: {
        port: 3030,
        hot: true,
        https: true,
        historyApiFallback: true,
    },
});