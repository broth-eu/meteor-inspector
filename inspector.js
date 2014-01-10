var cp = Npm.require('child_process');

var defaultSettings = {
    // port of node-inspector's web UI
    webPort: 8080,

    // restart delay of node-inspector in milliseconds
    delay: 200,

    // function which is responsible for killing the given (running) node-inspector process.
    // generally, it should not be necessary to provide an alternative implementation.
    kill: function (inspectorProcess) {
        inspectorProcess.kill();
    }
}

Inspector = {
    runIfDebugging: function (settings) {
        var isDebug = process.execArgv[0];
        if (isDebug) {
            // ensure that settings are initialized properly
            if (!settings) {
                settings = defaultSettings;
            } else {
                if (typeof settings.webPort !== 'number') {
                    settings.webPort = defaultSettings.webPort;
                }
                if (typeof settings.delay !== 'number' || settings.delay < 1) {
                    settings.delay = defaultSettings.delay;
                }
                if (typeof settings.kill !== 'function') {
                    settings.kill = defaultSettings.kill;
                }
            }

            // start node-inspector after the delay specified by given settings
            setTimeout(function() {
                var inspector = cp.spawn('node-inspector', ['--web-port=' + settings.webPort]);
                inspector.stdout.on('data', function(data) {
                   console.info('inspector: ' + data);
                });
                inspector.stderr.on('data', function(data) {
                    console.warn('inspector: ' + data);
                });

                process.on('SIGTERM', function () {
                    settings.kill(inspector);
                    process.exit(0);
                });

            }, settings.delay);
        }
    }
}
