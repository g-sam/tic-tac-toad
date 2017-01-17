import path from 'path';

const config = {
  devtool: 'source-map',
  entry: [
    'babel-polyfill',
    './src/index.js',
  ],
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
  },
  module: {
    loaders: [{
      test: /\.js$/,
      include: path.join(__dirname, 'src'),
      loader: 'babel-loader',
      query: {
        presets: ['latest', 'stage-2'],
      },
    }],
  },
  devServer: {
    stats: {
      colors: true,
      hash: false,
      version: false,
      assets: false,
      chunks: false,
    },
  },
};

export default config;
