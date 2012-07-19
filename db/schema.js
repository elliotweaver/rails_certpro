/*
 db/schema.js contains database schema description for application models
 by default (when using jugglingdb as ORM) this file uses database connection
 described in config/database.json. But it's possible to use another database
 connections and multiple different schemas, docs available at

 http://railwayjs.com/orm.html

 Example of model definition:

 define('User', function () {
     property('email', String, { index: true });
     property('password', String);
     property('activated', Boolean, {default: false});
 });

 Example of schema configured without config/database.json (heroku redistogo addon):
 schema('redis', {url: process.env.REDISTOGO_URL}, function () {
     // model definitions here
 });

*/

customSchema(function () {

    var mongoose = require('mongoose');
    mongoose.connect('mongodb://oxygen:0xygenPro@ds035237.mongolab.com:35237/rails_certpro');
    var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

    var Muser = new Schema({
      role: String,
      username: String,
      email: String,
      password: String,
      hash: String,
      salt: String,
      first: String,
      last: String,
      address: String,
      address2: String,
      city: String,
      state: String,
      zip: String,
      company: String,
      dob: String,
      website: String,
      phone: String,
      cell: String,
      cc_token: String,
      cc_last4: String,
      cc_type: String,
      cc_customer: String,
      location: [Number],
      jobs: [String],
      status: String,
      created: String,
      updated: String,
      accessed: String
  }, { strict: true });
    module.exports['Muser'] = mongoose.model('User', Muser); 
    
    var Mcategory = new Schema({
      name: String,
      created: String,
      updated: String
    }, { strict: true });
    module.exports['Mcategory'] = mongoose.model('Category', Mcategory);
    
    var Mjob = new Schema({
      name: String,
      description: String,
      price: String,
      categories: [String],
      created: String,
      updated: String
    }, { strict: true });
    module.exports['Mjob'] = mongoose.model('Job', Mjob);
    
    var Mproject = new Schema({
      job: String,
      price: String,
      name: String,
      phone: String,
      email: String,
      address: String,
      address2: String,
      city: String,
      state: String,
      zip: String,
      location: [Number],
      log: String,
      status: String,
      created: String,
      updated: String
    }, { strict: true });
    module.exports['Mproject'] = mongoose.model('Project', Mproject);

});

var Category = describe('Category', function () {
    property('name', String);
    property('created', String);
    property('updated', String);
});
var Job = describe('Job', function () {
    property('name', String);
    property('description', String);
    property('price', String);
    property('categories', String);
    property('created', String);
    property('updated', String);
});
var User = describe('User', function () {
    property('role', String);
    property('username', String);
    property('email', String);
    property('password', String);
    property('hash', String);
    property('salt', String);
    property('first', String);
    property('last', String);
    property('address', String);
    property('address2', String);
    property('city', String);
    property('state', String);
    property('zip', String);
    property('company', String);
    property('dob', String);
    property('website', String);
    property('phone', String);
    property('cell', String);
    property('cc_token', String);
    property('cc_last4', String);
    property('cc_type', String);
    property('cc_customer', String);
    property('location', String);
    property('jobs', String);
    property('status', String);
    property('created', String);
    property('updated', String);
    property('accessed', String);
});
var Project = describe('Project', function () {
    property('job', String);
    property('price', String);
    property('name', String);
    property('phone', String);
    property('email', String);
    property('address', String);
    property('address2', String);
    property('city', String);
    property('state', String);
    property('zip', String);
    property('location', String);
    property('log', String);
    property('status', String);
    property('created', String);
    property('updated', String);
});
var Lead = describe('Lead', function () {
    property('contractor', String);
    property('project', String);
    property('job', String);
    property('price', String);
    property('cc_token', String);
    property('log', String);
    property('status', String);
    property('created', String);
    property('updated', String);
});
var Log = describe('Log', function () {
    property('name', String);
    property('severity', String);
    property('note', String);
    property('created', String);
    property('updated', String);
});