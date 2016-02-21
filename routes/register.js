'use strict'

//noinspection JSUnresolvedFunction
const AccountModel = require("../model/Account");

exports.use = function (server) {


    server.route({
        method: 'GET',
        path: '/register',
        handler: function (request, reply) {
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
        handler: function (request, reply) {
            //reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
            let input = request.payload;
            let errors = [];

            AccountModel.findOne({
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

                            server
                                .seneca
                                .act({
                                    role: 'mail',
                                    cmd: 'send',
                                    from: 'postmaster@appsflare.com',
                                    to: input.email
                                }, (err=> {
                                    console.log(err);
                                }));

                            reply.view('register', {
                                title: 'Welcome to ludicrum',
                                messages: ["Account created successfully"],
                                errors: errors,
                                model: input
                            });

                            return Promise.resolve(newAcc)
                        });

                })
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