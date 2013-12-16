var cp = Meteor.require('child_process');

var defaultSettings = {
    // restart delay of node-inspector in milliseconds
    delay: 1000,

    // function which is responsible for killing the given (running) node-inspector process
    kill: function (inspectorProcess) {
        // calling inspector.kill() or using the kill system command do not work,
        // so we've picked the pkill system command instead
        cp.exec('pkill -P ' + inspectorProcess.pid);
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
                if (!settings.delay || settings.delay < 500) {
                    settings.delay = defaultSettings.delay;
                }
                if (typeof settings.kill !== 'function') {
                    settings.kill = defaultSettings.kill;
                }
            }

            // start node-inspector after the delay specified by given settings
            setTimeout(function() {
                var inspector = cp.exec('node-inspector');
                process.on('SIGTERM', function () {
                    settings.kill(inspector);
                    process.exit(0);
                });
            }, settings.delay);
        }
    }
}
