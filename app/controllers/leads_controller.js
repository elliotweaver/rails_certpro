load('application');

before(loadLead, {only: ['show', 'edit', 'update', 'destroy']});

action('new', function () {
    this.title = 'New lead';
    this.lead = new Lead;
    render();
});

action(function create() {
    Lead.create(req.body.Lead, function (err, lead) {
        if (err) {
            flash('error', 'Lead can not be created');
            render('new', {
                lead: lead,
                title: 'New lead'
            });
        } else {
            flash('info', 'Lead created');
            redirect(path_to.leads());
        }
    });
});

action(function index() {
    this.title = 'Leads index';
    Lead.all(function (err, leads) {
        render({
            leads: leads
        });
    });
});

action(function show() {
    this.title = 'Lead show';
    render();
});

action(function edit() {
    this.title = 'Lead edit';
    render();
});

action(function update() {
    this.lead.updateAttributes(body.Lead, function (err) {
        if (!err) {
            flash('info', 'Lead updated');
            redirect(path_to.lead(this.lead));
        } else {
            flash('error', 'Lead can not be updated');
            this.title = 'Edit lead details';
            render('edit');
        }
    }.bind(this));
});

action(function destroy() {
    this.lead.destroy(function (error) {
        if (error) {
            flash('error', 'Can not destroy lead');
        } else {
            flash('info', 'Lead successfully removed');
        }
        send("'" + path_to.leads() + "'");
    });
});

function loadLead() {
    Lead.find(params.id, function (err, lead) {
        if (err || !lead) {
            redirect(path_to.leads());
        } else {
            this.lead = lead;
            next();
        }
    }.bind(this));
}
