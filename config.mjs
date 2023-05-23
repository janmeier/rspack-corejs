import path from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from 'html-webpack-plugin'

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isRunningWebpack = !!process.env.WEBPACK;
const isRunningRspack = !!process.env.RSPACK;
if (!isRunningRspack && !isRunningWebpack) {
  throw new Error("Unknown bundler");
}

/**
 * @type {import('webpack').Configuration | import('@rspack/cli').Configuration}
 */
const config = {
  mode: "development",
  devtool: false,
  entry: {
    main: "./src/index.js",
  },
  module: {
    rules: [
      isRunningWebpack
        ? {
            test: /\.jsx?$/i,
            exclude: [path.resolve(__dirname, 'node_modules')],
            use: [
              {
                loader: "babel-loader",
                options: {
                  presets: [
                    [
                      "@babel/env",
                      {
                        useBuiltIns: "usage",
                        corejs: "3.30.2",
                        targets: ["safari>=12"],
                      },
                    ],
                  ],
                },
              },
            ],
          }
        : {
            test: /\.js$/,
            include: [path.resolve(__dirname, 'src')],
            type: "javascript/auto",
          },
    ],
  },
  output: {
    path: isRunningWebpack
      ? path.resolve(__dirname, "webpack-dist")
      : path.resolve(__dirname, "rspack-dist"),
    filename: "main.js",
  },
  resolve: {
    alias: {
      "./answer": path.resolve(__dirname, "./src/answer.js?raw"),
    },
  },
  plugins: [isRunningWebpack ? new HtmlWebpackPlugin({
    title: 'Webpack'
  }) : null].filter(Boolean)
};

if (isRunningRspack) {
  config.builtins = {
    presetEnv: {
      targets: ["safari>=12"],
      coreJs: "3.30.2",
      mode: "usage",
    },
    html: [
      {
        title: "rspack",
      },
    ],
  };
}

export default config;
