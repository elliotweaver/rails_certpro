load('application');

layout('admin');

before(loadTransaction, {only: ['show', 'edit', 'update', 'destroy']});

action('new', function () {
    this.title = 'New transaction';
    this.transaction = new Transaction;
    render();
});

action(function create() {
    Transaction.create(req.body.Transaction, function (err, transaction) {
        if (err) {
            flash('error', 'Transaction can not be created');
            render('new', {
                transaction: transaction,
                title: 'New transaction'
            });
        } else {
            flash('info', 'Transaction created');
            redirect(path_to.transactions());
        }
    });
});

action(function index() {
    this.title = 'Transactions index';
    Transaction.all(function (err, transactions) {
        render({
            transactions: transactions
        });
    });
});

action(function show() {
    this.title = 'Transaction show';
    render();
});

action(function edit() {
    this.title = 'Transaction edit';
    render();
});

action(function update() {
    this.transaction.updateAttributes(body.Transaction, function (err) {
        if (!err) {
            flash('info', 'Transaction updated');
            redirect(path_to.transaction(this.transaction));
        } else {
            flash('error', 'Transaction can not be updated');
            this.title = 'Edit transaction details';
            render('edit');
        }
    }.bind(this));
});

action(function destroy() {
    this.transaction.destroy(function (error) {
        if (error) {
            flash('error', 'Can not destroy transaction');
        } else {
            flash('info', 'Transaction successfully removed');
        }
        send("'" + path_to.transactions() + "'");
    });
});

function loadTransaction() {
    Transaction.find(params.id, function (err, transaction) {
        if (err || !transaction) {
            redirect(path_to.transactions());
        } else {
            this.transaction = transaction;
            next();
        }
    }.bind(this));
}
