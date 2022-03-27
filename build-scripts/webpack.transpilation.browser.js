const webpack = require("webpack");
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const getTargetOutputPath = mode => `browser${mode === "development" ? "-debug" : ""}`;

module.exports = ({ mode }) => ({
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [`${getTargetOutputPath(mode)}/*`],
            dangerouslyAllowCleanPatternsOutsideProject: true,
            dry: false
        }),
        new webpack.DefinePlugin({
            "BROWSER": true
        })
    ],
    output: {
        filename: path.join(
            getTargetOutputPath(mode),
            `advanced-logger.browser${mode === "production" ? ".min" : ""}.js`
        ),
        libraryTarget: "umd"
    }
});
