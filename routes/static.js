'use strict'

exports.use = function (server) {

    server.register(require('inert'), (err) => {

        if (err) {
            throw err;
        }
    });

    server.route({
        method: 'GET',
        path: '/content/{param*}',
        handler: {
            directory: {
                path: 'content'
            }
        }
    });

};