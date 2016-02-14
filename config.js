'use strict';

module.exports = {
    db: process.env.DB || 'mongodb://127.0.0.1:27017/ludicrum',
    port: process.env.PORT || 4000,
    mailingServiceHost: process.env.MAILING_SERVICE_HOST || '127.0.0.1',
    mailingServicePort: process.env.MAILING_SERVICE_PORT || 4001,
    gatewayHosts: process.env.GATEWAY_HOSTS,
    amqpServiceHost: process.env.AMQP_SERVICE_HOST
};