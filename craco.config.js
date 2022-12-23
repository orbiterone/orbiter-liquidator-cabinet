const webpack = require('webpack')

module.exports = {
  webpack: {
    plugins: {
      add: [
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        }),
      ],
    },
    configure: {
      resolve: {
        fallback: {
          stream: require.resolve('stream-browserify'),
          https: require.resolve('https-browserify'),
          os: require.resolve('os-browserify/browser'),
          http: require.resolve('stream-http'),
          buffer: require.resolve('buffer'),
        },
      },
    },
  },
}
