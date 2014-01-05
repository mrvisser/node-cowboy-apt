
var _ = require('underscore');
var apt = require('apt');
var child_process = require('child_process');
var colors = require('colors');
var util = require('util');

var reporting = require('../../lib/reporting');

var Command = module.exports = function() {
    this._numSuccess = 0;
    this._numError = 0;
};

Command.prototype.help = function() {
    return {
        'description': 'Install an aptitude package on an ubuntu machine',
        'args': '[--force-conf=old (old | new)] <package name>[=<package version>]',
        'exampleArgs': [
            'redis-server',
            'redis-server=2:2.6.16-3',
            '--force-conf=new redis-server'
        ]
    };
};

Command.prototype.validate = function(ctx, done) {
    var argv = _argv(ctx);
    if (!_.isArray(argv._) || argv._.length !== 1) {
        return done('Must specify one package to install');
    } else if (!_.contains(['old', 'new'], argv['force-conf'])) {
        return done('If the --force-conf argument is specified, its value must be one of "old" or "new"');
    }

    return done();
};

Command.prototype.before = function(ctx, done) {
    var argv = _argv(ctx);
    console.log();
    console.log('Installing package: %s', argv._[0].bold);
    console.log();

    reporting.printTableHeader('Host', 'Result');

    return done();
};

Command.prototype.exec = function(ctx, reply, done) {
    var argv = _argv(ctx);
    var confnew = (argv['force-conf'] === 'new') ? true : false;

    // Begin the install execution
    var install = apt.install(argv._[0], function(err, pkg) {
        reply({
            'type': 'complete',
            'data': {
                'error': err,
                'pkg': pkg
            }
        });

        //return done();
    });

    // Send data back to cowboy process as it comes to help prevent unwarranted timeouts
    install.on('stdout', function(data) {
        reply({
            'type': 'data',
            'stream': 'stdout',
            'data': data
        });
    });

    install.on('stderr', function(data) {
        reply({
            'type': 'data',
            'stream': 'stderr',
            'data': data
        });
    });
};

Command.prototype.hostEnd = function(ctx, host, responses, done) {
    var msg = null;
    var pkg = _.find(responses, function(response) { return (response.type === 'complete'); });
    if (!pkg || !pkg.data) {
        this._numError++;
        msg = 'Invalid response received'.red;
    } else if (pkg.data.error) {
        this._numError++;
        msg = 'An error occurred while installing the package'.red;
    } else {
        this._numSuccess++;
        msg = util.format('Installed: %s', util.format('%s=%s (%s)', pkg.data.pkg.Package, pkg.data.pkg.Version, pkg.data.pkg.Status).bold);
    }

    reporting.printTableRow(host, msg);

    return done();
};

Command.prototype.end = function(ctx, responses, expired, done) {
    var numTotal = _.chain(responses).keys().union(expired).compact().value().length;
    var numExpired = 0;
    _.each(expired, function(host) {
        numExpired++;
        reporting.printTableRow(host, 'Timed out'.yellow);
    });

    reporting.printTableFooter();

    console.log();
    reporting.printSummary(numTotal, this._numSuccess, this._numError, numExpired);
    console.log();

    return done();
};

var _argv = function(ctx) {
    return require('optimist')
        .default('force-conf', 'old')
        .parse(ctx.args());
};
