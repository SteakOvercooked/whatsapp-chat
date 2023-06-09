const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const tsxRule = {
  test: /\.(ts|js)x?$/,
  use: [
    {
      loader: 'babel-loader',
    },
  ],
  exclude: /node_modules/,
};

const cssRule = {
  test: /\.s?css$/,
  use: [
    MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        importLoaders: 2,
        modules: {
          auto: /\.module\.s?css$/,
          localIdentName: '[local]_[hash:base64:5]',
        },
      },
    },
    'postcss-loader',
    'sass-loader',
  ],
};

module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    port: 3000,
    historyApiFallback: true,
    static: {
      directory: path.resolve(__dirname, 'src/static'),
    },
  },
  entry: {
    index: path.resolve(__dirname, 'src/index.tsx'),
  },
  output: {
    publicPath: '/',
  },
  module: {
    rules: [tsxRule, cssRule],
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.scss'],
    alias: {
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@api': path.resolve(__dirname, 'src/api'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@store': path.resolve(__dirname, 'src/store'),
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles.[contenthash].css',
    }),
    new HtmlWebpackPlugin({
      title: 'WhatsApp Chat',
      template: '!!pug-loader!' + path.resolve(__dirname, 'src/index.pug'),
    }),
  ],
};
