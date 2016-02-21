'use strict'

//noinspection JSUnresolvedFunction
const AccountModel = require("../model/Account");

exports.use = function (server) {

    server.route({
        method: 'GET',
        path: '/login',
        handler: function (request, reply) {
            reply.view('login', {
                title: 'Welcome to ludicrum',
                errors: [],
                messages: [],
                model: {
                    username: '',
                    password: ''
                }
            });
        }
    });

    server.route({
        method: 'POST',
        path: '/login',
        handler: function (request, reply) {
            reply.view('login', {
                title: 'Welcome to ludicrum',
                errors: [],
                messages: [],
                model: {
                    username: '',
                    password: ''
                }
            });
        }
    });
};