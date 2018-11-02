const path = require('path');
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const exportLibraryName = "advancedLogger";
const getPostfix = mode => mode === "production" ? ".min" : "";
const getFolderPostfix = mode => mode === "development" === true ? "-debug" : "";
const getTargetFolder = target => target === 'browser' ? 'browser' : 'node';

module.exports = env => {
    console.log(env);

    const mode = env.prod === 1 ? 'production' : 'development';
    const watch = env.watch === 1;

    const browserConf = {
        mode,
        outputFile: `advanced-logger.browser${getPostfix(mode)}.js`,
        outputFolder: `${getTargetFolder(env.target)}${getFolderPostfix(mode)}`,
        target: 'web',
        libraryTarget: 'window',
        alias: {
            "node-fetch": './fetchFacade'
        }
    };

    const nodeConf = {
        mode,
        outputFile: `advanced-logger.node${getPostfix(mode)}.js`,
        outputFolder: `${getTargetFolder(env.target)}${getFolderPostfix(mode)}`,
        target: 'node',
        libraryTarget: 'commonjs2'
    };

    // todo Reuse the same *conf object
    const config = env.target === 'browser' ? browserConf : nodeConf;

    const libPath = (name = browserConf.outputFolder, target = browserConf.target) => path.join(target, name);

    // configuration object for webpack
    return {
        entry: './src/index.ts',
        target: config.target,
        output: {
            library: exportLibraryName,
            filename: libPath(config.outputFile, config.outputFolder),
            libraryTarget: config.libraryTarget
        },
        devtool: "sourcemaps",
        watch,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000,
            ignored: /node_modules/
        },
        mode: config.mode,
        externals: env.target === 'browser' ? [] : [nodeExternals()],
        resolve: {
            extensions: ['.ts', '.js', '.mjs'],
            modules: env.target === 'browser' ? ['node_modules', 'src'] : ['src'],
            alias: config.alias,
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
            //new BundleAnalyzerPlugin()
            new CopyWebpackPlugin([{from: 'interface/**/*', to: '.', context: "src"}])
        ]
    };
};
