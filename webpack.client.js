var webpack = require("webpack");
var path = require("path");

module.exports = {
	target:  "web",
	cache:   false,
	context: __dirname,
	devtool: false,
	entry:   {
		"example": "./src/example"
	},
	output:  {
		path:          path.join(__dirname, "dist"),
		filename:      "[name].js",
		chunkFilename: "[name].[id].js",
		publicPath:    "/"
	},
	plugins: [
		new webpack.DefinePlugin({"process.env": {NODE_ENV: '"production"'}}),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.UglifyJsPlugin()
	],
	module:  {
		loaders: [
			{test: /\.json$/, loaders: ["json"]},
			{test: /\.js$/, loaders: ["babel?cacheDirectory&presets[]=es2015&presets[]=stage-0"], exclude: /node_modules/}
		],
		noParse: /\.min\.js$/
	},
	resolve: {
		modulesDirectories: [
			"src",
			"node_modules",
			"web_modules"
		],
		extensions: ["", ".json", ".js"]
	},
	node:    {
		__dirname:     true,
		fs:            'empty'
	}
};
