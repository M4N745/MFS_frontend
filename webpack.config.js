const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const DotEnv = require('dotenv-webpack');

module.exports = (_env, argv) => {
  const isProduction = argv.mode === 'production';
  const { mode } = argv;
  const isDevelopment = mode === 'development';

  return {
    devtool: isDevelopment && 'cheap-module-source-map',
    entry: './src/index.tsx',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'assets/js/[name].[contenthash:8].js',
      publicPath: '/',
      assetModuleFilename: 'static/media/[hash][ext][query]',
    },
    module: {
      rules: [
        {
          test: /\.(js|ts)x?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              plugins: [
                isDevelopment && require.resolve('react-refresh/babel'),
              ].filter(Boolean),
            },
          },
        },
        {
          test: /\.module.css$/i,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: true,
              },
            },
          ],
        },
        {
          test: /\.css$/i,
          exclude: /\.module\.css$/i,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
          ],
        },
        {
          test: /\.(jpg|png|gif|eot|otf|ttf|woff|woff2)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.svg$/,
          use: ['@svgr/webpack'],
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      alias: {
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@settings': path.resolve(__dirname, 'src/settings'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@static_data': path.resolve(__dirname, 'src/static_data'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@assets': path.resolve(__dirname, 'src/assets'),
        '@custom_types': path.resolve(__dirname, 'src/types'),
      },
    },
    plugins: [
      isDevelopment && new ReactRefreshWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: 'assets/css/[name].[contenthash:8].css',
        chunkFilename: 'assets/css/[name].[contenthash:8].chunk.css',
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(
          isProduction ? 'production' : 'development',
        ),
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public/index.html'),
        favicon: path.resolve(__dirname, 'public/favicon.ico'),
        inject: true,
      }),
      new ESLintPlugin({
        extensions: ['ts', 'tsx'],
        failOnError: !isProduction,
        quiet: isProduction,
      }),
      new CopyPlugin({
        patterns: [
          {
            from: '*.(json|txt)',
            context: path.resolve(__dirname, 'public'),
          },
          {
            from: 'locales/**/*',
            context: path.resolve(__dirname, 'public'),
          },
        ],
      }),
      new DotEnv(),
    ].filter(Boolean),
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserWebpackPlugin({
          terserOptions: {
            compress: {
              comparisons: false,
            },
            mangle: {
              safari10: true,
            },
            output: {
              comments: false,
              ascii_only: true,
            },
            warnings: false,
          },
        }),
        new CssMinimizerPlugin(),
      ],
      runtimeChunk: 'single',
    },
    devServer: {
      compress: true,
      historyApiFallback: true,
      allowedHosts: "all",
      open: true,
      hot: true,
    },
  };
};
