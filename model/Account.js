/**
 * Created by srinath on 18/01/16.
 */

'use strict'

const mongoose = require('../lib/mongoose');

let AccountModel = mongoose.model('Account', {
    username: String,
    email: String,
    firstName: String,
    lastName: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: 'disabled'
    }
});

module.exports = AccountModel;