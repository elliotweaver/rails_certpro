load('application');

before(loadJob, {only: ['show', 'edit', 'update', 'destroy']});

action('new', function () {
    this.title = 'New job';
    this.job = new Job;
    render();
});

action(function create() {
    Job.create(req.body.Job, function (err, job) {
        if (err) {
            flash('error', 'Job can not be created');
            render('new', {
                job: job,
                title: 'New job'
            });
        } else {
            flash('info', 'Job created');
            redirect(path_to.jobs());
        }
    });
});

action(function index() {
    this.title = 'Jobs index';
    Job.all(function (err, jobs) {
        render({
            jobs: jobs
        });
    });
});

action(function show() {
    this.title = 'Job show';
    render();
});

action(function edit() {
    this.title = 'Job edit';
    render();
});

action(function update() {
    this.job.updateAttributes(body.Job, function (err) {
        if (!err) {
            flash('info', 'Job updated');
            redirect(path_to.job(this.job));
        } else {
            flash('error', 'Job can not be updated');
            this.title = 'Edit job details';
            render('edit');
        }
    }.bind(this));
});

action(function destroy() {
    this.job.destroy(function (error) {
        if (error) {
            flash('error', 'Can not destroy job');
        } else {
            flash('info', 'Job successfully removed');
        }
        send("'" + path_to.jobs() + "'");
    });
});

function loadJob() {
    Job.find(params.id, function (err, job) {
        if (err || !job) {
            redirect(path_to.jobs());
        } else {
            this.job = job;
            next();
        }
    }.bind(this));
}
