load('application');

layout('admin');

before(loadJob, {only: ['show', 'edit', 'update', 'destroy']});

action('new', function () {
    this.title = 'New job';
    this.job = new Job;
    render();
});

action(function create() {
    
    //will become the data feed for the model
    var data = req.body.Job;
    //update the timestamp
    data['created'] = data['updated'] = new Date().getTime();
    
    //transform data
    data.price = parseFloat(data.price);
    
    //validate data
    Job.validatesPresenceOf('price');
    Job.validatesNumericalityOf('price', {float: true});
    Job.validate('price', function(err) {
      if (isNaN(data.price)) {
        return err("Price is not a nummber");
      }
    });
  
    //create data
    Job.create(data, function(err, job) {
      if (err) {
        flash('error', 'Job can not be created');
        render('new', {
            job: job,
            title: 'New job'
        });
      } else {
        Mjob.update({_id: job.id}, data, function (err) {
          flash('info', 'Job created');
          redirect(path_to.jobs());
        }.bind(this));
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
    
    //will become the data feed for the model
    var data = body.Job;
    //update the timestamp
    data['updated'] = new Date().getTime();
    
    //transform data
    data.price = parseFloat(data.price);
    
    //validate data
    Job.validatesPresenceOf('price');
    Job.validatesNumericalityOf('price', {float: true});
    Job.validate('price', function(err) {
      if (isNaN(data.price)) {
        return err("Price is not a nummber");
      }
    });

    this.job.updateAttributes(data, function(err, job) {
      if (!err) {
        Mjob.update({_id: this.job.id}, data, function (err) {
          if (!err) {
              flash('info', 'Job updated');
              redirect(path_to.job(this.job));
          } else {
              flash('error', 'Job can not be updated');
              this.title = 'Edit job details';
              render('edit');
          }
        }.bind(this));
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

action(function getJobs() {
  Job.all(function (err, jobs) {
    var items = [];
    jobs.forEach(function(job) {
      items.push({key: job.id, value: job.name+' ($'+job.price+')'});
    });
    send(items);
  });
});

action(function getJobsInCategory() {
  Mjob.find({}).where('categories', req.query.category).exec(function (err, jobs) {
    var items = [];
    jobs.forEach(function(job) {
      items.push({key: job.id, value: job.name});
    });
    send(items);
  });
});

function loadJob() {
    Job.find(params.id, function (err, job) {
        if (err || !job) {
            redirect(path_to.jobs());
        } else {
            this.job = job;
            Mcategory.find({}).where('_id').in(job.categories).exec(function(err, docs) {
              this.categories = docs;
              next();
            }.bind(this));
        }
    }.bind(this));
}
