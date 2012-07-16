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

var Category = describe('Category', function () {
    property('name', String);
    property('author', String);
    property('created', String);
    property('updated', String);
});var Job = describe('Job', function () {
    property('name', String);
    property('description', String);
    property('price', String);
    property('author', String);
    property('created', String);
    property('updated', String);
});var User = describe('User', function () {
    property('role', String);
    property('username', String);
    property('email', String);
    property('first', String);
    property('last', String);
    property('company', String);
    property('dob', String);
    property('websitete', String);
    property('phone', String);
    property('cell', String);
    property('cc_token', String);
    property('ip', String);
    property('browser', String);
    property('status', String);
    property('created', String);
    property('updated', String);
    property('accessed', String);
});var Project = describe('Project', function () {
    property('job', String);
    property('name', String);
    property('phone', String);
    property('email', String);
    property('zip', String);
    property('ip', String);
    property('leads', String);
    property('browser', String);
    property('createted', String);
    property('updated', String);
});var Lead = describe('Lead', function () {
    property('contractor', String);
    property('project', String);
    property('transaction', String);
    property('status', String);
    property('created', String);
    property('updated', String);
});var Transaction = describe('Transaction', function () {
    property('project', String);
    property('job', String);
    property('price', String);
    property('cc_token', String);
    property('status', String);
    property('created', String);
    property('updated', String);
});var Log = describe('Log', function () {
    property('name', String);
    property('severity', String);
    property('note', String);
    property('created', String);
    property('updated', String);
});