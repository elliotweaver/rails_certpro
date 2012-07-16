require('../test_helper.js').controller('leads', module.exports);

var sinon  = require('sinon');

function ValidAttributes () {
    return {
        contractor: '',
        project: '',
        transaction: '',
        status: '',
        created: '',
        updated: ''
    };
}

exports['leads controller'] = {

    'GET new': function (test) {
        test.get('/leads/new', function () {
            test.success();
            test.render('new');
            test.render('form.' + app.set('view engine'));
            test.done();
        });
    },

    'GET index': function (test) {
        test.get('/leads', function () {
            test.success();
            test.render('index');
            test.done();
        });
    },

    'GET edit': function (test) {
        var find = Lead.find;
        Lead.find = sinon.spy(function (id, callback) {
            callback(null, new Lead);
        });
        test.get('/leads/42/edit', function () {
            test.ok(Lead.find.calledWith('42'));
            Lead.find = find;
            test.success();
            test.render('edit');
            test.done();
        });
    },

    'GET show': function (test) {
        var find = Lead.find;
        Lead.find = sinon.spy(function (id, callback) {
            callback(null, new Lead);
        });
        test.get('/leads/42', function (req, res) {
            test.ok(Lead.find.calledWith('42'));
            Lead.find = find;
            test.success();
            test.render('show');
            test.done();
        });
    },

    'POST create': function (test) {
        var lead = new ValidAttributes;
        var create = Lead.create;
        Lead.create = sinon.spy(function (data, callback) {
            test.strictEqual(data, lead);
            callback(null, lead);
        });
        test.post('/leads', {Lead: lead}, function () {
            test.redirect('/leads');
            test.flash('info');
            test.done();
        });
    },

    'POST create fail': function (test) {
        var lead = new ValidAttributes;
        var create = Lead.create;
        Lead.create = sinon.spy(function (data, callback) {
            test.strictEqual(data, lead);
            callback(new Error, lead);
        });
        test.post('/leads', {Lead: lead}, function () {
            test.success();
            test.render('new');
            test.flash('error');
            test.done();
        });
    },

    'PUT update': function (test) {
        Lead.find = sinon.spy(function (id, callback) {
            test.equal(id, 1);
            callback(null, {id: 1, updateAttributes: function (data, cb) { cb(null); }});
        });
        test.put('/leads/1', new ValidAttributes, function () {
            test.redirect('/leads/1');
            test.flash('info');
            test.done();
        });
    },

    'PUT update fail': function (test) {
        Lead.find = sinon.spy(function (id, callback) {
            test.equal(id, 1);
            callback(null, {id: 1, updateAttributes: function (data, cb) { cb(new Error); }});
        });
        test.put('/leads/1', new ValidAttributes, function () {
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

