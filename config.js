'use strict';

module.exports = {
    db: process.env.DB || 'mongodb://127.0.0.1:27017/ludicrum',
    port: process.env.PORT || 4000,
    gatewayHosts: process.env.GATEWAY_HOSTS,
    amqpServiceHost: process.env.AMQP_SERVICE_HOST
};