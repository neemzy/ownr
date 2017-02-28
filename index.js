var Client = require('ssh2').Client,

    hosts = require('./hosts'),
    command = process.argv[2];

if (process.argv.length <= 2) {
    console.log('Usage: npm start \'xdg-open http://gandalfgif.github.io\'');
    process.exit();
}

// Connect to hosts to run command
hosts.forEach(function(host) {
    var client = new Client();

    client.on('ready', function() {
        var prompt = client.config.username + '@' + client.config.host + '> ',
            log = console.log.bind(null, prompt);

        log('connection established');

        client.exec(command, function(err, stream) {
            if (err) {
                throw err;
            }

            log('running "' + command + '"');

            stream
                .on('close', function() {
                    log('connection closed');
                    client.end();
                })
                .on('data', function(data) {
                    log('STDOUT: ' + data);
                })
                .stderr.on('data', function(data) {
                    log('STDERR: ' + data);
                });
        });
    });

    client.connect(host);
});
