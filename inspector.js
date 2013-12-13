Inspector = {
    runIfDebugging: function (delay) {
        var isDebug = process.execArgv[0];
        if (isDebug) {
            var cp = Meteor.require('child_process');
            setTimeout(function() {
                var inspector = cp.exec('node-inspector');
                process.on('SIGTERM', function () {
                    // calling inspector.kill() or using the kill system command do not work,
                    // so we've picked the pkill system command
                    cp.exec('pkill -P ' + inspector.pid);
                    process.exit(0);
                });
            }, delay? delay : 1000);
        }
    }
}
