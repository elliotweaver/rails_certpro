require('../test_helper.js').controller('jobs', module.exports);

var sinon  = require('sinon');

function ValidAttributes () {
    return {
        name: '',
        description: '',
        price: '',
        author: '',
        created: '',
        updated: ''
    };
}

exports['jobs controller'] = {

    'GET new': function (test) {
        test.get('/jobs/new', function () {
            test.success();
            test.render('new');
            test.render('form.' + app.set('view engine'));
            test.done();
        });
    },

    'GET index': function (test) {
        test.get('/jobs', function () {
            test.success();
            test.render('index');
            test.done();
        });
    },

    'GET edit': function (test) {
        var find = Job.find;
        Job.find = sinon.spy(function (id, callback) {
            callback(null, new Job);
        });
        test.get('/jobs/42/edit', function () {
            test.ok(Job.find.calledWith('42'));
            Job.find = find;
            test.success();
            test.render('edit');
            test.done();
        });
    },

    'GET show': function (test) {
        var find = Job.find;
        Job.find = sinon.spy(function (id, callback) {
            callback(null, new Job);
        });
        test.get('/jobs/42', function (req, res) {
            test.ok(Job.find.calledWith('42'));
            Job.find = find;
            test.success();
            test.render('show');
            test.done();
        });
    },

    'POST create': function (test) {
        var job = new ValidAttributes;
        var create = Job.create;
        Job.create = sinon.spy(function (data, callback) {
            test.strictEqual(data, job);
            callback(null, job);
        });
        test.post('/jobs', {Job: job}, function () {
            test.redirect('/jobs');
            test.flash('info');
            test.done();
        });
    },

    'POST create fail': function (test) {
        var job = new ValidAttributes;
        var create = Job.create;
        Job.create = sinon.spy(function (data, callback) {
            test.strictEqual(data, job);
            callback(new Error, job);
        });
        test.post('/jobs', {Job: job}, function () {
            test.success();
            test.render('new');
            test.flash('error');
            test.done();
        });
    },

    'PUT update': function (test) {
        Job.find = sinon.spy(function (id, callback) {
            test.equal(id, 1);
            callback(null, {id: 1, updateAttributes: function (data, cb) { cb(null); }});
        });
        test.put('/jobs/1', new ValidAttributes, function () {
            test.redirect('/jobs/1');
            test.flash('info');
            test.done();
        });
    },

    'PUT update fail': function (test) {
        Job.find = sinon.spy(function (id, callback) {
            test.equal(id, 1);
            callback(null, {id: 1, updateAttributes: function (data, cb) { cb(new Error); }});
        });
        test.put('/jobs/1', new ValidAttributes, function () {
            test.success();
            test.render('edit');
            test.flash('error');
            test.done();
        });
    },

    'DELETE destroy': function (test) {
        test.done();
    },

    'DELETE destroy fail': function (test) {
        test.done();
    }
};

