/**
 * Created by srinath on 27/12/15.
 */

'use strict';



const config = require('./config');

const Hapi = require('hapi');
const Vision = require('vision');
const Ejs = require('ejs');
const Good = require('good');
const chairo = require('chairo');
//const _ = require('underscore');
const KongApiSyncPlugin = require('./plugins/kong-api-sync');
const RegisterRoutes = require("./routes/register");

const server = new Hapi.Server();

//setting application port
server.connection({
    port: config.port
});

server.register(chairo, err => {
    if (err) {
        return;
    }
    server.seneca
        .use('mesh', { auto:true, pin:'role:auth' })
        .client({
            type: 'tcp',
            host: config.mailingServiceHost,
            port: config.mailingServicePort,
            pin: 'role:mail'
        });
});

//registering view plugin
server.register(Vision, (err) => {

    if (err) {
        throw err;
    }

    server.views({
        engines: {
            ejs: Ejs
        },
        relativeTo: __dirname,
        path: 'views'
    });

    server.route({
        method: 'GET',
        path: '/ping',
        handler: function(request, reply) {
            reply('pong');
        }
    });

    RegisterRoutes.use(server);

    server.register({
        register: KongApiSyncPlugin.register,
        options: {
            sync: true,
            apis: [{
                name: 'Authentication',
                strip_request_path: true,
                request_path: '/authentication/'
            }]
        }
    }, function(err, next) {

        if (err) {
            console.info("synchronizing upstream url with kong failed, " + err);
            console.error(err);
            throw err;
        }
        console.log('Synchronized API with kong');
        next();
    });

    server.register({
        register: Good,
        options: {
            reporters: [{
                reporter: require('good-console'),
                events: {
                    response: '*',
                    log: '*'
                }
            }]
        }
    }, (err) => {
        if (err) {
            throw err; // something bad happened loading the plugin
        }

        server.start(() => {
            server.log('info', 'Server running at: ' + server.info.uri);
        });
    });


});