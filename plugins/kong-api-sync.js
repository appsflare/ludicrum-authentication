/**
 * Created by srinath on 27/12/15.
 */
'use strict';

const King = require('kingkong');
const _ = require('underscore');
const os = require('os');

function getAllNetworkAddresses() {
    let ifaces = os.networkInterfaces();

    return _.chain(Object.keys(ifaces))
        .map((name) => ifaces[name])
        .reduceRight((a, b) => a.concat(b))
        .filter(face => 'IPv4' === face.family)
        .value();
}

function getNetworkAddress(internal) {

    let address = '127.0.0.1';

    let face = _.find(getAllNetworkAddresses(), face => face.internal == internal);

    return face ? face.address : '127.0.0.1';
}


function KongHelpers(client) {
    this.client = client;
}

KongHelpers.prototype.getCustomer = function(id) {
    return this.client.get('customer', id);
};

function kongAPISyncPlugin(server, options, next) {

    let port = server.connections[0].settings.port;
    if (!options.upstream_url) {
        if (!options.baseUrlResolver) {
            options.baseUrlResolver = function() {
                return 'http://localhost:' + port;
            };
        }
        options.upstream_url = 'http://' + getNetworkAddress(false) + ':' + (port || 3000);
    }

    /*
     *TODO: Need to find better logic to generate api
     *list from registered routes
     */
    if (options.generateApis) {


        var registeredRoutes = server.table();

        let routes = _.chain(registeredRoutes)
            .map(i => {
                return {
                    name: i.path.split('/')[0],
                    request_path: i.request_path,
                    upstream_url: options.upstream_url
                };
            })
            .value();

        options.apis = routes;

    }

    options.apis.forEach(i => {
        if (!i.upstream_url) {
            i.upstream_url = options.upstream_url;
        }
    });


    const existingOnSync = options.onSync;

    options.onSync = () => {

        next();

        if (existingOnSync && existingOnSync instanceof Function) {
            existingOnSync();
        }

    };

    server.kong = new KongHelpers(new King(options));


}

// exports.forEachInterface = function(callback) {
//     getAllNetworkAddresses().forEach(callback);
// };

exports.register = kongAPISyncPlugin;
exports.register.attributes = {
    name: 'kong-api-sync',
    version: '1.0.0'
};