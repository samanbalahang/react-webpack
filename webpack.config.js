var glob = require('glob');
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
  devtool: "source-map",
  watch: true,
  plugins: [
    new MiniCssExtractPlugin({
      filename: '../src/css/[name].css'
      }),
   ],
  mode: 'production',
  entry: glob.sync('./src/**.js').reduce(function(obj, el){
    obj[path.parse(el).name] = el;
    return obj
    },{}),
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './public/scripts/'),
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', "@babel/preset-react"]
          }
        }
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader,
          'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        exclude: /(node_modules|bower_components)/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.less$/i,
        use: [
          // compiles Less to CSS
          MiniCssExtractPlugin.loader,
          "css-loader",
          "less-loader",
        ],
      },
    ]
  },
  resolve: {
    extensions: ['.css','.scss', '.js']
  },
  optimization: {
    minimize: true,
    splitChunks: {
      cacheGroups: {
        cssStyles: {
          type: "css/mini-extract",
          name: "styles_css",
          chunks: (chunk) => {
            return chunk.name === "css";
          },
          enforce: true,
        },
      },
    },
  },
};