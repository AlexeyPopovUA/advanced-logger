const {merge} = require('webpack-merge');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const getBrowserTranspilationCfg = require("./webpack.transpilation.browser");
const getNodeTranspilationCfg = require("./webpack.transpilation.node.js");
const devServerCfg = require("./webpack.server");

const commonConfig = {
  devtool: 'sourcemaps',
  entry: './src/index.ts',
  plugins: [
    // new BundleAnalyzerPlugin()
  ],
  resolve: {
    extensions: ['.js', '.mjs', '.ts'],
  },
  output: {
    library: 'advancedLogger',
  },
};

/**
 * Verifies and maps the mode from environment into the mode recognizable by the builder.
 *
 * @param {string} mode - mode requested through the environment.
 * @returns {string} verified supported mode.
 */
const mapToMode = mode => (mode === 'prod' ? 'production' : 'development');

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
  if (typeof env.modes === 'string' && env.modes.length > 0) {
    modes.push(/**@type string*/env.modes);
  } else if (Array.isArray(env.modes)) {
    (/**@type string[]*/env.modes).forEach(mode => modes.push(mode));
  } else {
    modes.push('dev');
  }

  const targets = [];
  if (typeof env.targets === 'string' && env.targets.length > 0) {
    targets.push(/**@type string*/env.targets);
  } else if (Array.isArray(env.targets)) {
    (/**@type string[]*/env.targets).forEach(target => targets.push(target));
  } else {
    targets.push('browser');
  }

  const watch = env.watch === 1;
  const buildConfigs = [];

  for (const mode of modes) {
    for (const target of targets) {
      const buildMode = mapToMode(mode);
      const config = merge(
        commonConfig,
        getTranspilationCfg(target, buildMode),
        {watch, mode: buildMode},
        watch && devServerCfg,
      );
      buildConfigs.push(config);
    }
  }

  return buildConfigs;
};
