
const path = require('path')
const webpack = require('webpack')
const Minify = require('uglifyjs-webpack-plugin')
const dev = process.env.NODE_ENV === "dev"
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const ManifestPlugin = require('webpack-manifest-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

let cssLoaders = [
	{ loader: 'css-loader', options: { importLoaders: 1, minimize : !dev } },
	{
		loader:'postcss-loader',
		options: {
			plugins: (loader) => [
				require('autoprefixer')({
					browsers:['last 2 versions', 'ie > 8']
				})
			]
		}
	}
]
const pugData = require('./data/globals.json')
// Silence the beast!
let hush = {
	//assets: true,
    cached: false,
    cachedAssets: false,
    children: false,
    chunks: false,
    chunkModules: false,
    chunkOrigins: false,
    //colors: false,
    depth: false,
    entrypoints: false,
    //errors: true,
    //errorDetails: true,
    //hash: false,
    maxModules: 0,
    modules: false,
    //performance: false,
    providedExports: false,
    publicPath: false,
    reasons: false,
    source: false,
    timings: false,
    usedExports: false,
    version: false,
    //warnings: false 
}
let config = {
	entry:{
		main:['./src/css/main.scss', './src/js/main.js']
	},
	watch:dev,
	output: {
		path:path.resolve('./public'),
		filename:dev ? '[name].js' : '[name].[chunkhash:8].js'
	},
	resolve: {
		alias: {
			'@root':path.resolve(),
			'@css':path.resolve('./src/css/'),
			'@images':path.resolve('./src/images'),
			'@':path.resolve('./src/js/')
		}
	},
	devtool:dev ? "cheap-module-eval-source-map" : false,
	devServer: {
		contentBase: path.resolve('./public'),
		stats:hush
	},
	module: {
		rules: [
			{
				enforce: 'pre',
				test:/\.js$/,
				exclude: /(node_modules|bower_components)/,
				use:[
					'eslint-loader'
				]
			},
			{
				test:/\.scss$/,
				use: ExtractTextPlugin.extract({
		          fallback: "style-loader",
		          use: [...cssLoaders, 'sass-loader']
		        })
			},
			{
				test:/\.(svg|wof2?|eot|ttf|otf)(\?.*)$/,
				loader: 'file-loader'
			},
			{
				test: /\.(png|jpe?g|gif|svg)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 8192,
							name:'[name].[hash:8].[ext]'
						}
					},
					{
						loader:'img-loader',
						options:{
							enabled:!dev
						}
					}
				]
			},
			{
				test: /\.pug$/,
				use: [
					{
						loader:'raw-loader'
					},
					{
						loader:'pug-html-loader',
						options:{
							data:pugData,
							pretty:true
						}
					}
				]
			}
		]
	},
	plugins:[
		new ExtractTextPlugin({
			filename: dev ? '[name].css' : '[name].[contenthash:8].css',
		}),
/*        new webpack.ProvidePlugin({
            faker: 'faker'
        })*/
	]
}

const glob = require('glob')
const files = glob.sync(process.cwd() + '/src/pug/**/*.pug', {
	ignore: [
        "**/_*",    // Exclude files starting with '_'.
        "**/_*/**"  // Exclude entire directories starting with '_'.
    ]
})
global.faker = require('faker')
files.forEach(file => {
	config.plugins.push(new HtmlWebpackPlugin({
		filename:path.basename(file).replace('.pug', '.html'),
		template:file
	}))
})

if(!dev){
	config.plugins.push(new Minify({
		sourceMap: false
	}))
	config.plugins.push(new ManifestPlugin())
	config.plugins.push(new CleanWebpackPlugin(['public'], {
		root: path.resolve('./'),
		verbose:true,
		dry:false
	}))
}

module.exports = config