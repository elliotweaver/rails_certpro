require('../test_helper.js').controller('transactions', module.exports);

var sinon  = require('sinon');

function ValidAttributes () {
    return {
        project: '',
        job: '',
        price: '',
        cc_token: '',
        status: '',
        created: '',
        updated: ''
    };
}

exports['transactions controller'] = {

    'GET new': function (test) {
        test.get('/transactions/new', function () {
            test.success();
            test.render('new');
            test.render('form.' + app.set('view engine'));
            test.done();
        });
    },

    'GET index': function (test) {
        test.get('/transactions', function () {
            test.success();
            test.render('index');
            test.done();
        });
    },

    'GET edit': function (test) {
        var find = Transaction.find;
        Transaction.find = sinon.spy(function (id, callback) {
            callback(null, new Transaction);
        });
        test.get('/transactions/42/edit', function () {
            test.ok(Transaction.find.calledWith('42'));
            Transaction.find = find;
            test.success();
            test.render('edit');
            test.done();
        });
    },

    'GET show': function (test) {
        var find = Transaction.find;
        Transaction.find = sinon.spy(function (id, callback) {
            callback(null, new Transaction);
        });
        test.get('/transactions/42', function (req, res) {
            test.ok(Transaction.find.calledWith('42'));
            Transaction.find = find;
            test.success();
            test.render('show');
            test.done();
        });
    },

    'POST create': function (test) {
        var transaction = new ValidAttributes;
        var create = Transaction.create;
        Transaction.create = sinon.spy(function (data, callback) {
            test.strictEqual(data, transaction);
            callback(null, transaction);
        });
        test.post('/transactions', {Transaction: transaction}, function () {
            test.redirect('/transactions');
            test.flash('info');
            test.done();
        });
    },

    'POST create fail': function (test) {
        var transaction = new ValidAttributes;
        var create = Transaction.create;
        Transaction.create = sinon.spy(function (data, callback) {
            test.strictEqual(data, transaction);
            callback(new Error, transaction);
        });
        test.post('/transactions', {Transaction: transaction}, function () {
            test.success();
            test.render('new');
            test.flash('error');
            test.done();
        });
    },

    'PUT update': function (test) {
        Transaction.find = sinon.spy(function (id, callback) {
            test.equal(id, 1);
            callback(null, {id: 1, updateAttributes: function (data, cb) { cb(null); }});
        });
        test.put('/transactions/1', new ValidAttributes, function () {
            test.redirect('/transactions/1');
            test.flash('info');
            test.done();
        });
    },

    'PUT update fail': function (test) {
        Transaction.find = sinon.spy(function (id, callback) {
            test.equal(id, 1);
            callback(null, {id: 1, updateAttributes: function (data, cb) { cb(new Error); }});
        });
        test.put('/transactions/1', new ValidAttributes, function () {
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

