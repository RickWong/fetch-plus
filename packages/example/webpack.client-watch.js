var webpack = require("webpack");
var config = require("./webpack.client.js");

config.cache = true;
config.debug = true;
config.devtool = "eval-sourcemap";

config.entry._wds = "webpack-dev-server/client?http://localhost:8080";
config.entry._hmr = "webpack/hot/only-dev-server";

config.output.publicPath = "http://localhost:8080/";
config.output.hotUpdateMainFilename = "update/[hash]/update.json";
config.output.hotUpdateChunkFilename = "update/[hash]/[id].update.js";

config.plugins = [
	new webpack.HotModuleReplacementPlugin()
];

config.devServer = {
	publicPath:  "http://localhost:8080/",
	contentBase: "./dist",
	hot:         true,
	inline:      true,
	lazy:        false,
	quiet:       true,
	noInfo:      false,
	headers:     {"Access-Control-Allow-Origin": "*"},
	stats:       {colors: true}
};

module.exports = config;
