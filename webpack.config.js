const SkyBuildSetup = require('sky-build-setup');
const PackageJson = require('./package.json');
const path = require('path');

module.exports = SkyBuildSetup(
	PackageJson.name,
	PackageJson.build,
	path.resolve(__dirname)
);