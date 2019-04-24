const path = require("path");
//const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const nodeExternals = require("webpack-node-externals");

const exportLibraryName = "advancedLogger";
const cjsLibraryName = "advanced-logger";
const getPostfix = mode => mode === "production" ? ".min" : "";
const getFolderPostfix = mode => mode === "development" === true ? "-debug" : "";
const getTargetFolder = target => target === "browser" ? "browser" : "node";

/**
 * @param mode
 * @returns {string}
 */
const mapToMode = mode => mode === "prod" ? "production" : "development";

/**
 * @param target
 * @returns {boolean}
 */
const isBrowser = target => target === "browser";

/**
 * @param buildMode
 * @param target
 */
const getBrowserConf = (buildMode, target) => ({
    buildMode,
    outputFile: `advanced-logger.browser${getPostfix(buildMode)}.js`,
    outputFolder: `${getTargetFolder(target)}${getFolderPostfix(buildMode)}`,
    library: {
        root: exportLibraryName,
        amd: cjsLibraryName,
        commonjs: cjsLibraryName
    },
    libraryTarget: 'umd',
    alias: {
        "node-fetch": "./fetchFacade"
    }
});

/**
 * @param buildMode
 * @param target
 */
const getNodeConf = (buildMode, target) => ({
    buildMode,
    outputFile: `advanced-logger.node${getPostfix(buildMode)}.js`,
    outputFolder: `${getTargetFolder(target)}${getFolderPostfix(buildMode)}`,
    target: "node",
    libraryTarget: "commonjs2"
});

/**
 * @param {boolean} isBrowserTarget
 * @param targetEnvironmentConfig
 * @param {string} libraryName
 * @param {boolean} watch
 */
const getConfiguration = (isBrowserTarget, targetEnvironmentConfig, libraryName, watch) => ({
    entry: "./src/index.ts",
    target: targetEnvironmentConfig.target,
    output: {
        library: libraryName,
        filename: path.join(targetEnvironmentConfig.outputFolder, targetEnvironmentConfig.outputFile),
        libraryTarget: targetEnvironmentConfig.libraryTarget
    },
    devtool: "sourcemaps",
    watch,
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000,
        ignored: /node_modules/
    },
    mode: targetEnvironmentConfig.buildMode,
    externals: isBrowserTarget ? [] : [nodeExternals()],
    resolve: {
        extensions: [".ts", ".js", ".mjs"],
        modules: isBrowserTarget ? ["node_modules", "src"] : ["src"],
        alias: targetEnvironmentConfig.alias,
        // todo Resolve the problem with mjs import from node_modules
        mainFields: ["main", "module"]
    },
    module: {
        rules: [
            {test: /\.ts$/, loader: "awesome-typescript-loader"},
            {enforce: "pre", test: /\.js$/, loader: "source-map-loader"}
        ]
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ["**/*", /*"../coverage",*/ "../cache-jest", "../*.tgz"],
            dangerouslyAllowCleanPatternsOutsideProject: true,
            dry: false
        }),
        //new BundleAnalyzerPlugin()
        new CopyWebpackPlugin([{from: "interface/**/*", to: ".", context: "src"}])
    ]
});

module.exports = env => {
    console.log(env);

    const watch = env.watch === 1;
    const buildConfigs = [];

    const modes = [];

    if (typeof env.modes === "string" && env.modes.length > 0) {
        modes.push(env.modes);
    } else if (Array.isArray(env.modes)) {
        env.modes.forEach(mode => modes.push(mode));
    } else {
        modes.push("dev");
    }

    const targets = [];

    if (typeof env.targets === "string" && env.targets.length > 0) {
        targets.push(env.targets);
    } else if (Array.isArray(env.targets)) {
        env.targets.forEach(mode => targets.push(mode));
    } else {
        targets.push("dev");
    }

    for (const mode of modes) {
        const mappedMode = mapToMode(mode);

        for (const target of targets) {
            const config = isBrowser(target) ? getBrowserConf(mappedMode, target) : getNodeConf(mappedMode, target);
            buildConfigs.push(getConfiguration(isBrowser(target), config, exportLibraryName, watch));
        }
    }

    return buildConfigs;
};
