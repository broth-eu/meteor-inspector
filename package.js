Package.describe({
    summary: 'Ensures that if meteor is in debug mode node-inspector is running'
});

Package.on_use(function (api, where) {
    api.use(['npm'], 'server');

    api.add_files(['inspector.js'], 'server');

    if (api.export) {
        api.export('Inspector');
    }
});
