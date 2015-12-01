var webpack = require("webpack");
var path    = require("path");

module.exports = {
	cache:   false,
	context: __dirname,
	output:  {
		libraryTarget: "umd"
	},
	plugins: [
		new webpack.DefinePlugin({"process.env": {NODE_ENV: '"production"'}}),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.OccurenceOrderPlugin()
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
			"web_modules"
		],
		extensions:         ["", ".json", ".js"]
	},
	node:    {
		__dirname: true,
		fs:        'empty'
	}
};
