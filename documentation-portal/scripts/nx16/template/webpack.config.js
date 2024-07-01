const { composePlugins, withNx } = require('@nrwl/webpack');
const { withReact } = require('@nx/react');


// Helper for combining webpack config objects
const { merge } = require('webpack-merge');
const getWebpackConfig = require('@nx/react/plugins/webpack');

module.exports = composePlugins(withNx(), withReact(), (config) => {
    const newConfig = getWebpackConfig(config);

  /**
   * Added webpack configuration to separate the json files
   * from the config folder into a separate chunk...
   * with this now , we can inject the config files separated
   * to replace in the different stages =)
   */
  const merged = merge(newConfig, {
    optimization: {
      splitChunks: {
        minSize: 0,
        cacheGroups: {
          /**
           * Added webpack configuration to separate the json files
           * from the config folder into a separate chunk...
           * with this now , we can inject the config files separated
           * to replace in the different stages =)
           */
          secrets: {
            test: /config\/secrets.ts/,
            filename: 'config/secrets.js',
            chunks: 'all',
            enforce: true,
            name(module) {
              const filename = module.rawRequest.replace(/^.*[\\/]/, '');
              return filename.substring(0, filename.lastIndexOf('.'));
            },
          },
        },
      },
    },
    module: {
      rules: [
        {
          test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
              },
            },
          ],
          exclude: /node_modules/
        },
      ],
    },
    ignoreWarnings: [/Failed to parse source map/],
  });
  
  return merged;
});
