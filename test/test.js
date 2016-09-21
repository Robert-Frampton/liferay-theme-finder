'use strict';

var _ = require('lodash');
var path = require('path');
var test = require('ava');

var initCwd = process.cwd();
var themeFinder;

test.after(function() {
	process.chdir(initCwd);
});

test.before(function() {
	delete require.cache[path.join(__dirname, '../index.js')];

	process.chdir(path.join(__dirname, 'fixtures/themes/7.0/base-theme'));

	themeFinder = require('../index.js');
});

test.cb('name should retrieve package.json file from npm', function(t) {
	var pkgName = 'lfr-product-menu-animation-themelet';

	themeFinder.name(pkgName, function(err, pkg) {
		t.true(_.isNull(err), 'error is null');
		t.true(_.isObject(pkg.liferayTheme), 'liferayTheme object is present');
		t.true(pkg.keywords.indexOf('liferay-theme') > -1, 'package has liferay-theme keyword');
		t.is(pkg.name, pkgName, 'package has correct name');

		t.end();
	});
});

test.cb('name should return error because module does not exist', function(t) {
	themeFinder.name('fake-themelet-123', function(err, pkg) {
		t.true(_.isUndefined(pkg), 'pkg is undefined');
		t.is(err.message, 'Package or version doesn\'t exist', 'it has appropriate error message');

		t.end();
	});
});

test.cb('name should return error because module is not a liferay theme module', function(t) {
	themeFinder.name('generator-liferay-theme', function(err, pkg) {
		t.true(_.isNull(pkg), 'pkg is null');
		t.is(err.message, 'Package is not a Liferay theme or themelet module', 'it has appropriate error message');

		t.end();
	});
});

test.cb('find should return an object when searching for global modules', function(t) {
	themeFinder.find(function(themeResults) {
		t.true(_.isObject(themeResults));

		t.end();
	});
});

test.cb('find should return an object when searching for npm modules', function(t) {
	themeFinder.find({
		globalModules: false,
		themelet: true
	}, function(themeResults) {
		_.forEach(themeResults, function(item, index) {
			t.true(_.isObject(item));
			t.true(_.isObject(item.liferayTheme), 'liferayTheme object is present');
			t.true(item.keywords.indexOf('liferay-theme') > -1, 'package has liferay-theme keyword');
		});

		t.true(_.isObject(themeResults));

		t.end();
	});
});