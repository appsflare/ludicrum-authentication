'use strict'

const AccountModel = require("../model/Account");

exports.use = function(server) {

    server.route({
        method: 'GET',
        path: '/',
        handler: function(request, reply) {
            reply.view('register', {
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
        path: '/register',
        handler: function(request, reply) {
            //reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
            reply.view('register', {
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
        path: '/register',
        handler: function(request, reply) {
            //reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
            let input = request.payload;
            let errors = [];

            Promise.all([AccountModel.findOne({
                        username: input.username.toLowerCase()
                    })
                    .then(account => {
                        //if account already exists, then throw exception saying username is already taken
                        if (account) {
                            return Promise.reject(new Error('Username already taken.'));
                        }

                        var model = new AccountModel(input);

                        return model
                            .save()
                            .then(newAcc => {
                                reply.view('register', {
                                    title: 'Welcome to ludicrum',
                                    messages: ["Account created successfully"],
                                    errors: errors,
                                    model: input
                                });
                            });

                    })
                ])
                .catch(e => {
                    errors.push(e.message);
                    reply.view('register', {
                        title: 'Welcome to ludicrum',
                        errors: errors,
                        model: input
                    });
                });



        }
    });

};