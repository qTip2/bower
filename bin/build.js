#!/usr/bin/env node

var fs = require('fs'),
	cp = require('child_process'),
	path = require('path'),
	json = require( path.join(__dirname, '..', '..', 'package.json') ),
	parent = path.join(__dirname, '..'),
	relative = path.relative(path.join(parent, '..'), parent);

// Output to bower.json
fs.writeFile('bower.json', JSON.stringify({
	"name": json.name.toLowerCase(),
	"description": json.description,
	"version": json.version,
	"homepage": "http://qtip2.com",
	"location": "https://github.com/arrayjam/bower-qtip2/",
	"repository": json.repository,
	"authors": [ json.author ],
	"license": json.licenses.map(function(license) { return license.type }),
	"keywords": json.keywords,
	"main": [
		"./jquery.qtip.js",
		"./basic/jquery.qtip.js"
	],
	"ignore": [
		"bin"
	]
}, null, 4));

// Copy files from grunt-ed output
cp.exec('grunt --dist="'+relative+'" --stable', {}, function(error, stdout, stderr) {
	if (error !== null) { return console.log('exec error: ' + error); }

	// Also generate basic files
	cp.exec('grunt basic --dist="'+relative+'" --stable', {}, function(error, stdout, stderr) {
		if (error !== null) { return console.log('exec error: ' + error); }

		// Add the files to the git repo
		cp.exec('git add *');
	});
});