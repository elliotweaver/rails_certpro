load('application');

layout('admin');

before(use('requireAdmin'));
before(loadLog, {only: ['show', 'edit', 'update', 'destroy']});

action('new', function () {
    this.title = 'New log';
    this.log = new Log;
    render();
});

action(function create() {
    Log.create(req.body.Log, function (err, log) {
        if (err) {
            flash('error', 'Log can not be created');
            render('new', {
                log: log,
                title: 'New log'
            });
        } else {
            flash('info', 'Log created');
            redirect(path_to.logs());
        }
    });
});

action(function index() {
    this.title = 'Logs index';
    Log.all(function (err, logs) {
        render({
            logs: logs
        });
    });
});

action(function show() {
    this.title = 'Log show';
    render();
});

action(function edit() {
    this.title = 'Log edit';
    render();
});

action(function update() {
    this.log.updateAttributes(body.Log, function (err) {
        if (!err) {
            flash('info', 'Log updated');
            redirect(path_to.log(this.log));
        } else {
            flash('error', 'Log can not be updated');
            this.title = 'Edit log details';
            render('edit');
        }
    }.bind(this));
});

action(function destroy() {
    this.log.destroy(function (error) {
        if (error) {
            flash('error', 'Can not destroy log');
        } else {
            flash('info', 'Log successfully removed');
        }
        send("'" + path_to.logs() + "'");
    });
});

function loadLog() {
    Log.find(params.id, function (err, log) {
        if (err || !log) {
            redirect(path_to.logs());
        } else {
            this.log = log;
            next();
        }
    }.bind(this));
}
