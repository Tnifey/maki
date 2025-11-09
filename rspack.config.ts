import path from "node:path";
import { defineConfig } from "@rspack/cli";

export default defineConfig({
    mode: "development",
    devtool: "source-map",
    context: path.resolve(__dirname, "src"),
    entry: {
        example: "./example.ts",
        maki: "./main.ts",
    },
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "[name].js",
        clean: true,
    },
    resolve: {
        extensions: [".ts", ".js", ".tsx", ".jsx"],
        tsConfig: {
            configFile: path.resolve(__dirname, "tsconfig.json"),
        },
        exportsFields: process.env.NODE_ENV === "production" ? ["default"] : undefined,
    },
    watchOptions: {
        ignored: /node_modules/,
        followSymlinks: true,
    },
    optimization: {
        minimize: true,
    },
    target: "web",
    module: {
        rules: [
            {
                test: /\.(j|t)s$/,
                exclude: [/node_modules/],
                loader: "builtin:swc-loader",
                options: {
                    jsc: {
                        target: "es2022",
                        parser: { syntax: "typescript" },
                    },
                },
                type: "javascript/auto",
            },
        ],
    },
    devServer: {
        port: 3060,
        hot: true,
        historyApiFallback: true,
    },
});
