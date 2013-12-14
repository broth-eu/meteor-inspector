# meteor-inspector

By default [meteor](http://www.meteor.com/) restarts each time a file has changed. If you are using
[node-inspector](https://github.com/node-inspector/node-inspector) for debugging your meteor application you always
have to restart the inspector manually to keep the UI connected to the debugger. With  meteor-inspector installed
(using [meteorite](https://github.com/oortcloud/meteorite)) and invoked during the server startup, the node-inspector's
lifecycle is managed in the background.

## Prerequisites

You need to install node-inspector and meteorite globally (if not done yet):
``` sh
$ npm install -g node-inspector
$ npm install -g meteorite
```



## Usage

To use meteor-inspector in your project, you first have to install it in the project's directory:
``` sh
$ cd /path/to/your/project
$ mrt add inspector
```

Furthermore, you have to invoke the inspector's ``runIfDebugging()`` method as first statement in the startup callback
of your server:
``` javascript
if (Meteor.isServer) {
  Meteor.startup(function () {
    Inspector.runIfDebugging();
    // ...
  });
}
```

When debugging is enabled you are now able to use node-inspector as long as meteor is running, even after an automatic
server restart. You are only required to refresh the debugger's website after each restart.

You simply can enable debugging globally with:
``` sh
$ export NODE_OPTIONS='--debug'
```

To disable it again, do the following:
``` sh
$ export NODE_OPTIONS=''
```



## Configuration
The current implementation provides two parameters that can be delivered to the inspector's ``runIfDebugging()`` method
in form of a settings object. As an alternative configuration (which does not work on my system because the node process
is not terminated!) you can take the following:
``` javascript
Inspector.runIfDebugging({
  delay: 1500,
  kill: function (inspectorProcess) {
    inspectorProcess.kill();
  }
});
```

If no settings object is given default settings are used, i.e. the delay to start node-inspector is set to 1000ms and
for killing the running node-inspector process the linux command ``pkill`` is invoked.