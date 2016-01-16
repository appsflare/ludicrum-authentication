/**
 * Created by srinath on 27/12/15.
 */

'use strict';

var port = process.env.APP_PORT || 4000;

const Hapi = require('hapi');
const Vision = require('vision');
const Ejs = require('ejs');
const Good = require('good');
const _ = require('underscore');
const KongApiSyncPlugin = require('./plugins/kong-api-sync');

const server = new Hapi.Server();
server.connection({port: port});

server.register(Vision, (err) => {

    if (err) {
        throw err;
    }

    server.views({
        engines: {ejs: Ejs},
        relativeTo: __dirname,
        path: 'views'
    });


    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            reply.view('signup', {
                title: 'Welcome to ludicrum'
            });
        }
    });

    server.route({
        method: 'GET',
        path: '/ping',
        handler: function (request, reply) {
            reply('pong');
        }
    });

    server.route({
        method: 'GET',
        path: '/singup',
        handler: function (request, reply) {
            //reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
            reply.view('signup', {
                title: 'Welcome to ludicrum'
            });
        }
    });

    server.route({
        method: 'POST',
        path: '/singup',
        handler: function (request, reply) {
            //reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
            reply.view('signup', {
                title: 'Welcome to ludicrum'
            });
        }
    });

    KongApiSyncPlugin.forEachInterface(address => {

        let upstreamUrl = 'http://' + address + ':' + port;
        server.register({
            register: KongApiSyncPlugin.getPlugin('kong-api-' + address),
            options: {
                upstream_url: upstreamUrl,
                sync: true,
                apis: [{
                    name: 'Authentication',
                    strip_request_path: true,
                    request_path: '/authentication/'
                }]
            }
        }, function (err, next) {

            if (err) {
                console.info("Registering upstream  url with kong failed, " + e);
                console.error(err);
                throw err;
            }
            console.log('Registering api with upstream url: ' + upstreamUrl);
            next();
        });

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