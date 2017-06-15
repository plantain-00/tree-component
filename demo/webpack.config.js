const webpack = require("webpack");
const path = require("path");

module.exports = {
    entry: {
        vue: "./demo/vue/index",
        react: "./demo/react/index",
        angular: "./demo/angular/index"
    },
    output: {
        path: __dirname,
        filename: "[name]/index.bundle.js"
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