const webpack = require("webpack");
const path = require("path");

module.exports = {
    entry: {
        vue: "./demo/vue/index",
        react: "./demo/react/index"
    },
    output: {
        path: path.join(__dirname, "demo"),
        filename: "[name].bundle.js"
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": JSON.stringify("production")
            }
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            output: {
                comments: false,
            },
        }),
    ],
    resolve: {
        alias: {
            "vue$": "vue/dist/vue.min.js"
        }
    }
};