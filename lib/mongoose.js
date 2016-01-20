/**
 * Created by srinath on 18/01/16.
 */
 
 'use strict'
 
const mongoose = require('mongoose');
const config = require('../config');

mongoose.connect(config.db);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('Connected to mongodb instance!!');
});

module.exports = mongoose;