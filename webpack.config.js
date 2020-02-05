const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const entries  = glob.sync('./src/index.js?');
const mainEntry = entries.length > 0 ? entries[0] : './src/index.js';
console.log("********************************************");
console.log(" - Entry matches: " + entries.length);
console.log(" - Selected entry point is: " + mainEntry);
module.exports = (env, argv) => {
    const MODE =  argv.mode  || 'development';
    const DEVELOPMENT_MODE = (MODE === 'development');

    const  webpackConfig = {
        devtool: DEVELOPMENT_MODE ? 'eval-source-map' : undefined,
        devServer: {
            inline: true,
            port: 3000,
            open: true,
            overlay: {
                warnings: false,
                errors: true
            }
        },
        optimization: {
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        compress: {
                            unused: false
                        }
                    }
                })
            ]
        },
        entry: ['babel-polyfill', mainEntry],
        output: {
            path: path.join(__dirname, '/dist'),
            filename: 'index.js',
        },
        resolve: {
            extensions: ['*', '.js', '.jsx']
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    include: /src/,
                    use: {
                        loader: "babel-loader"
                    },
                },
                {
                    test: /\.(css|scss|sass)$/,
                    loader: [
                        DEVELOPMENT_MODE ? 'style-loader' : MiniCssExtractPlugin.loader,
                        'css-loader',
                        'sass-loader'
                    ],
                },
                {
                    test: /\.(eot|svg|ttf|woff|woff2|png|jpg)$/,
                    use: ['file-loader'],
                },
            ]
        },
        plugins: [
            ...(!DEVELOPMENT_MODE ? [new MiniCssExtractPlugin({filename: "index.css"})] : []),
            new CopyWebpackPlugin([
                {
                    from: 'public',
                    ignore: ['index.html']
                }
            ]),
            new HtmlWebpackPlugin({
                template: './public/index.html',
            }),
        ]
    };

    if (DEVELOPMENT_MODE) {
        console.log(" - Webpack server starting in development mode!");
    } else {
        console.log(" - Webpack in production mode! This may take several minutes, be patient.");
    }
    console.log("********************************************");

    return webpackConfig;
}

