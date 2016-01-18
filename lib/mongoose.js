/**
 * Created by srinath on 18/01/16.
 */
 
 'use strict'
 
const mongoose = require('mongoose');

mongoose.connect(process.env.DB || 'mongodb://127.0.0.1:27017/ludicrum');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('Connected to mongodb instance!!');
});

module.exports = mongoose;