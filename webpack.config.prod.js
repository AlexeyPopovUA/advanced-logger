module.exports = env => {
    console.log(env);

    const mode = env.prod === 1 ? 'production' : 'development';
    const path = require('path');
    const exportLibraryName = "universalLogger";
    const browserProd = {
        mode,
        outputFile: 'universal-logger.browser.min.js',
        outputFolder: 'browser',
        target: 'web',
        libraryTarget: 'window'
    };

    const nodeProd = {
        mode,
        outputFile: 'universal-logger.node.min.js',
        outputFolder: 'node',
        target: 'node',
        libraryTarget: 'commonjs2'
    };

    const config = env.target === 'browser' ? browserProd : nodeProd;

    const libPath = (name = browserProd.outputFolder, target = browserProd.target) => path.join(target, name);

    return {
        entry: './src/index.ts',
        target: config.target,
        output: {
            library: exportLibraryName,
            filename: libPath(config.outputFile, config.outputFolder),
            libraryTarget: config.libraryTarget
        },
        devtool: "sourcemaps",
        mode: config.mode,
        resolve: {
            extensions: ['.ts', '.js'],
            modules: [
                'node_modules',
                'src',
            ]
        },
        module: {
            rules: [
                {test: /\.ts$/, loader: "awesome-typescript-loader"},
                {enforce: "pre", test: /\.js$/, loader: "source-map-loader"}
            ],
        }
    };
};
