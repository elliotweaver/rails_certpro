require('../test_helper.js').controller('logs', module.exports);

var sinon  = require('sinon');

function ValidAttributes () {
    return {
        name: '',
        severity: '',
        note: '',
        created: '',
        updated: ''
    };
}

exports['logs controller'] = {

    'GET new': function (test) {
        test.get('/logs/new', function () {
            test.success();
            test.render('new');
            test.render('form.' + app.set('view engine'));
            test.done();
        });
    },

    'GET index': function (test) {
        test.get('/logs', function () {
            test.success();
            test.render('index');
            test.done();
        });
    },

    'GET edit': function (test) {
        var find = Log.find;
        Log.find = sinon.spy(function (id, callback) {
            callback(null, new Log);
        });
        test.get('/logs/42/edit', function () {
            test.ok(Log.find.calledWith('42'));
            Log.find = find;
            test.success();
            test.render('edit');
            test.done();
        });
    },

    'GET show': function (test) {
        var find = Log.find;
        Log.find = sinon.spy(function (id, callback) {
            callback(null, new Log);
        });
        test.get('/logs/42', function (req, res) {
            test.ok(Log.find.calledWith('42'));
            Log.find = find;
            test.success();
            test.render('show');
            test.done();
        });
    },

    'POST create': function (test) {
        var log = new ValidAttributes;
        var create = Log.create;
        Log.create = sinon.spy(function (data, callback) {
            test.strictEqual(data, log);
            callback(null, log);
        });
        test.post('/logs', {Log: log}, function () {
            test.redirect('/logs');
            test.flash('info');
            test.done();
        });
    },

    'POST create fail': function (test) {
        var log = new ValidAttributes;
        var create = Log.create;
        Log.create = sinon.spy(function (data, callback) {
            test.strictEqual(data, log);
            callback(new Error, log);
        });
        test.post('/logs', {Log: log}, function () {
            test.success();
            test.render('new');
            test.flash('error');
            test.done();
        });
    },

    'PUT update': function (test) {
        Log.find = sinon.spy(function (id, callback) {
            test.equal(id, 1);
            callback(null, {id: 1, updateAttributes: function (data, cb) { cb(null); }});
        });
        test.put('/logs/1', new ValidAttributes, function () {
            test.redirect('/logs/1');
            test.flash('info');
            test.done();
        });
    },

    'PUT update fail': function (test) {
        Log.find = sinon.spy(function (id, callback) {
            test.equal(id, 1);
            callback(null, {id: 1, updateAttributes: function (data, cb) { cb(new Error); }});
        });
        test.put('/logs/1', new ValidAttributes, function () {
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

