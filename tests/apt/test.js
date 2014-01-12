
var _ = require('underscore');
var apt = require('apt');
var assert = require('assert');
var colors = require('colors');
var cowboyCli = require('cowboy-cli-api');
var testUtil = require('../util');
var util = require('util');

describe('Apt', function() {

    describe('Install', function() {

        it('gives a validation error if no module is specified', function(callback) {
            cowboyCli.cowboy(testUtil.defaultCowboyConfig(), 'cowboy-apt:install', function(code, output) {
                assert.strictEqual(code, 1);
                assert.strictEqual(output.split('\n')[2], 'Must specify one package to install');
                return callback();
            });
        });

        it('results in an error when trying to install non-existing package', function(callback) {
            this.timeout(30000);

            cowboyCli.cowboy(testUtil.defaultCowboyConfig(), 'cowboy-apt:install', ['node-cowboy-non-existing-package'], function(code, output) {
                assert.strictEqual(code, 0);

                var lines = output.split('\n');
                _assertInstallHeader(lines[1], 'node-cowboy-non-existing-package');
                _assertHostResult(lines[6], 'test_host', 'An error occurred while installing the package'.red);
                assert.strictEqual(lines[12], util.format('  Success: %s/1', '0'.green));
                assert.strictEqual(lines[13], util.format('    Error: %s/1', '1'.red));
                assert.ok(!lines[14]);
                return callback();
            });
        });

        it('installs a module', function(callback) {
            this.timeout(30000);

            // Install libpng3. Hopefully this is a somewhat stable thing to do
            cowboyCli.cowboy(testUtil.defaultCowboyConfig(), 'cowboy-apt:install', ['libpng3'], function(code, output) {
                assert.strictEqual(code, 0);

                // Ensure we get the expected install header
                var lines = output.split('\n');
                _assertInstallHeader(lines[1], 'libpng3');
                assert.strictEqual(lines[12], util.format('  Success: %s/1', '1'.green));
                assert.ok(!lines[13]);

                // Use apt to get the installed version and verify the output of the install command
                apt.show('libpng3', function(err, libpng) {
                    assert.ok(!err);
                    _assertInstallHostResultSuccess(lines[6], 'test_host', libpng.Package, libpng.Version);
                    return callback();
                });
            });
        });
    });

    describe('Show', function() {

        it('gives a validation error if no module is specified', function(callback) {
            cowboyCli.cowboy(testUtil.defaultCowboyConfig(), 'cowboy-apt:show', function(code, output) {
                assert.strictEqual(code, 1);
                assert.strictEqual(output.split('\n')[2], 'Must specify one package whose details to show');
                return callback();
            });
        });

        it('results in an error when trying to show a non-existing package', function(callback) {
            this.timeout(30000);

            cowboyCli.cowboy(testUtil.defaultCowboyConfig(), 'cowboy-apt:show', ['node-cowboy-non-existing-package'], function(code, output) {
                assert.strictEqual(code, 0);

                var lines = output.split('\n');
                _assertShowHeader(lines[1], 'node-cowboy-non-existing-package');
                _assertHostResult(lines[6], 'test_host', 'Package information not available'.red);
                assert.strictEqual(lines[12], util.format('  Success: %s/1', '0'.green));
                assert.strictEqual(lines[13], util.format('    Error: %s/1', '1'.red));
                assert.ok(!lines[14]);
                return callback();
            });
        });

        it('shows correct details for an installed module', function(callback) {
            this.timeout(30000);

            // Install libpng3. Hopefully this is a somewhat stable thing to do
            cowboyCli.cowboy(testUtil.defaultCowboyConfig(), 'cowboy-apt:install', ['libpng3'], function(code, output) {
                assert.strictEqual(code, 0);

                // Use apt to get the installed version and verify the output of the install command
                apt.show('libpng3', function(err, libpng) {
                    assert.ok(!err);

                    cowboyCli.cowboy(testUtil.defaultCowboyConfig(), 'cowboy-apt:show', ['libpng3'], function(code, output) {
                        assert.strictEqual(code, 0);

                        var lines = output.split('\n');
                        _assertShowHeader(lines[1], 'libpng3');
                        _assertHostResult(lines[6], 'test_host', util.format('%s=%s (install ok installed)'.bold, libpng.Package, libpng.Version));
                        assert.strictEqual(lines[12], util.format('  Success: %s/1', '1'.green));
                        assert.ok(!lines[13]);
                        assert.ok(!lines[14]);
                        return callback();
                    });
                });
            });
        });
    });
});

var _assertInstallHeader = function(headerLine, packageName) {
    assert.notEqual(headerLine.indexOf('Installing package'), -1);
    assert.notEqual(headerLine.indexOf(packageName), -1);
};

var _assertShowHeader = function(headerLine, packageName) {
    assert.notEqual(headerLine.indexOf('Inspecting package'), -1);
    assert.notEqual(headerLine.indexOf(packageName), -1);
};

var _assertInstallHostResultSuccess = function(resultLine, host, packageName, version) {
    var words = _.compact(resultLine.split(' '));
    assert.strictEqual(words[0], host);
    assert.strictEqual(words[1], '|');
    assert.strictEqual(words[2], 'Installed:');
    assert.notEqual(words[3].indexOf(util.format('%s=%s', packageName, version)), -1);
};

var _assertHostResult = function(resultLine, host, message) {
    var messageWords = message.split(' ').length;
    var words = _.compact(resultLine.split(' '));
    assert.strictEqual(words[0], host);
    assert.strictEqual(words[1], '|');
    assert.strictEqual(words.slice(2, 2 + messageWords).join(' '), message);
};