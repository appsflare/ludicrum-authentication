'use strict'

exports.use = function (server) {

    server.route({
        method: 'GET',
        path: '/',
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