var webpack = require("webpack");
var path    = require("path");

module.exports = {
	cache:   false,
	context: __dirname,
	devtool: "hidden-cheap-source-map",
	output:  {
		libraryTarget: "umd"
	},
	plugins: [
		new webpack.DefinePlugin({"process.env": {NODE_ENV: '"production"'}}),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.UglifyJsPlugin()
	],
	module:  {
		loaders: [
			{test: /\.json$/, loaders: ["json"]},
			{test:       /\.js$/,
				loaders: ["babel?cacheDirectory&presets[]=es2015&presets[]=stage-0"],
				exclude: /node_modules/
			}
		],
		noParse: /\.min\.js$/
	},
	resolve: {
		modulesDirectories: [
			"src",
			"node_modules",
			"web_modules",
			"packages",
			"."
		],
		extensions:         ["", ".json", ".js"]
	},
	externals: {
		"immutable": true,
		"xml2js": true
	},
	node:    {
		__dirname: true,
		fs:        'empty'
	}
};
