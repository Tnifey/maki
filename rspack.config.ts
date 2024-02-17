import { defineConfig } from '@rspack/cli';
import path from 'path';

export default defineConfig({
    mode: 'development',
    context: path.resolve(__dirname, 'src'),
    entry: {
        'main': './main.ts',
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js',
    },
    optimization: {
        minimize: false,
        chunkIds: 'deterministic',
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    watchOptions: {
        ignored: /node_modules/,
        followSymlinks: true,
    },
    module: {
        rules: [
            {
                test: /\.(t|j)sx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'builtin:swc-loader',
                    options: {
                        jsc: {
                            parser: {
                                syntax: 'typescript',
                                jsx: true,
                            },
                        },
                    },
                },
            },
        ],
    },
});
