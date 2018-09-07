const path = require('path');

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
            "./fetchFacade": './fetchFacade'
        }
    };

    const nodeConf = {
        mode,
        outputFile: `advanced-logger.node${getPostfix(mode)}.js`,
        outputFolder: `${getTargetFolder(env.target)}${getFolderPostfix(mode)}`,
        target: 'node',
        libraryTarget: 'commonjs2',
        alias: {
            "./fetchFacade": 'node-fetch'
        }
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
        resolve: {
            extensions: ['.ts', '.js'],
            modules: [
                'node_modules',
                'src',
            ],
            alias: config.alias
        },
        module: {
            rules: [
                {test: /\.ts$/, loader: "awesome-typescript-loader"},
                {enforce: "pre", test: /\.js$/, loader: "source-map-loader"}
            ],
        }
    };
};
