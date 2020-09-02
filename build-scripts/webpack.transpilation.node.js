const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const getTargetOutputPath = mode => `node${mode === 'development' ? '-debug' : ''}`;

module.exports = ({mode}) => ({
  target: "node",
  externals: [nodeExternals()],
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [`${getTargetOutputPath(mode)}/*`],
      dangerouslyAllowCleanPatternsOutsideProject: true,
      dry: false
    })
  ],
  module: {
    rules: [
      {
        exclude: /(node_modules)/,
        include: path.resolve('./src'),
        test: /\.(ts)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    useBuiltIns: 'usage',
                    //Points babel-preset-env plugin to the specific polyfills library version
                    corejs: 3,
                    //use debug option to check which polyfills were used for which classes and browsers
                    //debug: true,
                    targets: {
                      node: 10,
                    },
                  },
                ],
              ],
            },
          },
        ],
      },
    ],
  },
  output: {
    filename: path.join(
      getTargetOutputPath(mode),
      `advanced-logger.node${mode === 'production' ? '.min' : ''}.js`,
    ),
    libraryTarget: 'commonjs2',
  },
});
