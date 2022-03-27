const webpack = require("webpack");
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const nodeExternals = require("webpack-node-externals");

const getTargetOutputPath = mode => `node${mode === "development" ? "-debug" : ""}`;

module.exports = ({ mode }) => ({
    target: "node",
    externals: [nodeExternals()],
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [`${getTargetOutputPath(mode)}/*`],
            dangerouslyAllowCleanPatternsOutsideProject: true,
            dry: false
        }),
        new webpack.DefinePlugin({
            "BROWSER": false
        })
    ],

    output: {
        filename: path.join(
            getTargetOutputPath(mode),
            `advanced-logger.node${mode === "production" ? ".min" : ""}.js`
        ),
        libraryTarget: "commonjs2"
    }
});
