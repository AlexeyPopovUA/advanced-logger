const path = require("path");
const {merge} = require("webpack-merge");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const getBrowserTranspilationCfg = require("./webpack.transpilation.browser");
const getNodeTranspilationCfg = require("./webpack.transpilation.node");
const devServerCfg = require("./webpack.server");

const commonConfig = {
    devtool: "source-map",
    entry: "./src/index.ts",
    plugins: [
        // new BundleAnalyzerPlugin()
    ],
    resolve: {
        extensions: [".js", ".mjs", ".ts"]
    },
    externals: ["axios"],
    module: {
        rules: [
            {
                exclude: /(node_modules)/,
                test: /\.(ts)$/,
                use: [
                    "ts-loader"
                ]
            }
        ]
    },
    output: {
        path: path.resolve(process.cwd(), "dist"),
        library: 'advancedLogger',

    }
};

/**
 * Returns part of the build config for requested environment
 *
 * @param target {string} - build target - "node" or "browser"
 * @param mode {string} - build mode - "development" or "production"
 * @returns webpack configuration
 */
const getTranspilationCfg = (target, mode) => target === "node" ?
    getNodeTranspilationCfg({mode}) : getBrowserTranspilationCfg({mode});

/**
 * Creates the list of modes passed into environment,
 * generates and exports build configurations for each mode,
 *
 * @returns build configurations specified in the environment.
 */
module.exports = env => {
    console.log(env);

    const modes = [];

    env.production && modes.push("production");
    env.development && modes.push("development");

    const targets = [];

    env.node && targets.push("node");
    env.browser && targets.push("browser");

    const watch = env.watch === 1;
    const buildConfigs = [];

    console.log({modes, targets});

    for (const mode of modes) {
        for (const target of targets) {
            const config = merge(
                commonConfig,
                getTranspilationCfg(target, mode),
                {watch, mode},
                watch && devServerCfg
            );
            buildConfigs.push(config);
        }
    }

    return buildConfigs;
};
