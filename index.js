/**
 * Created by srinath on 27/12/15.
 */

'use strict';

var port = process.env.PORT || 4000;

const Hapi = require('hapi');
const Vision = require('vision');
const Ejs = require('ejs');
const Good = require('good');
const _ = require('underscore');
const KongApiSyncPlugin = require('./plugins/kong-api-sync');
const AccountModel = require("./model/Account");

const server = new Hapi.Server();

//setting application port
server.connection({
    port: port
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
        path: '/',
        handler: function(request, reply) {
            reply.view('signup', {
                title: 'Welcome to ludicrum',
                errors: [],
                messages: [],
                model: {
                    username: '',
                    password: '',
                    email: '',
                    firstName: '',
                    lastName: ''
                }
            });
        }
    });

    server.route({
        method: 'GET',
        path: '/ping',
        handler: function(request, reply) {
            reply('pong');
        }
    });

    server.route({
        method: 'GET',
        path: '/signup',
        handler: function(request, reply) {
            //reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
            reply.view('signup', {
                title: 'Welcome to ludicrum',
                errors: [],
                messages: [],
                model: {
                    username: '',
                    password: '',
                    email: '',
                    firstName: '',
                    lastName: ''
                }
            });
        }
    });

    server.route({
        method: 'POST',
        path: '/signup',
        handler: function(request, reply) {
            //reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
            let input = request.payload;
            let errors = [];

            AccountModel.findOne({
                    username: input.username.toLowerCase()
                })
                .then(account => {
                    //if account already exists, then throw exception saying username is already taken
                    if (account) {
                        throw new Error('Username already taken.');
                    }

                    var model = new AccountModel(input);

                    return model
                        .save()
                        .then(newAcc => {
                            reply.view('signup', {
                                title: 'Welcome to ludicrum',
                                messages: ["Account created successfully"],
                                errors: errors,
                                model: input
                            });
                        });

                })
                .catch(e => {
                    errors.push(e.message);
                    reply.view('signup', {
                        title: 'Welcome to ludicrum',
                        errors: errors,
                        model: input
                    });
                });



        }
    });


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