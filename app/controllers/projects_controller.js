load('application');

layout('admin');

before(loadProject, {only: ['show', 'edit', 'update', 'destroy']});

var braintree = require('braintree/lib/braintree');
var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: '4yfpm3ndby9rh6y7',
  publicKey: 'xztbktpdrwfpz8db',
  privateKey: 'pgz562g6cgc7k4x5'
});
var geo = require('geocoder');

action('new', function () {
    this.title = 'New project';
    this.project = new Project;
    render();
});

action(function create() {
    
  //will become the data feed for the model
  var data = req.body.Project;
  //update the timestamp
  data['created'] = data['updated'] = new Date().getTime();
  
  //transform data
  data.price = parseFloat(data.price);

  Project.validatesPresenceOf('job', 'name', 'phone', 'email', 'address', 'city', 'state', 'zip', 'status');
  Project.validatesFormatOf('email', {"with": /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i});
  Project.validate('price', function(err) {
    if (isNaN(data.price)) {
      return err("Price is not a nummber");
    }
  });
  
  //create address string for geolocation
  var address = req.body.Project["address"]+', '+req.body.Project["city"]+', '+req.body.Project["state"]+' '+req.body.Project["zip"];
  
  //run geolocation service
  geo.geocode(address, function (err, result) {
    
    //here the location is critical. we need to find a real location or else return an error
    if (!result.results[0]) {
      data.location = [ 0, 0 ];
      //TODO: throw error
    }
    
    //record the location and continue
    else {
      data.location = [ result.results[0].geometry.location.lat, result.results[0].geometry.location.lng ];
      
      Project.create(data, function (err, project) {
        
        //report error
        if (err) {
          flash('error', 'Project can not be created');
          render('new', {
              project: project,
              title: 'New project'
          });
        }
        
        else {
          
              Mproject.update({_id: project.id}, data, function (err) {
                
                //don't process and just go to the newly created project page
                if (data.status !== 'process')  {
                  flash('info', 'Project created');
                  redirect(path_to.project(project));
                }
                
                //process the project
                else {
                  
                  //get a list of nearby contractors via some formula
                  Muser.find({})
                    .where('status', 'active')
                    .where('role', 'contractor')
                    .where('jobs', project.job)
                    .where('location').near(project.location)
                    .exec(function(err, contractors) {
                      var total = num = 0;
                      contractors.every(function(contractor) {
                        var vals = {};
                        vals.contractor = contractor.id;
                        vals.project = project.id;
                        vals.job = project.job;
                        vals.price = project.price;
                        vals.cc_token = contractor.cc_token;
                        vals.status = 'process';
                        vals.created = vals.updated = new Date().getTime();
                        Lead.create(vals, function(err, lead) {
                          console.log('creating');
                          if (err) {
                            return true;
                          }
                          else {
                            gateway.transaction.sale({
                              amount: lead.price,
                              paymentMethodToken: lead.cc_token
                            }, function (err, result) {
                              console.log('after sale');
                              ++num;
                              if (err || !result.success) {
                                //error => set to fail
                                lead.updateAttributes({status: 'failed'}, function(err, lead) {
                                  if (num == contractors.length) {
                                    project.updateAttributes({status: 'success'}, function(err, docs) {
                                      flash('info', 'Project updated');
                                      redirect(path_to.project(project));
                                      return false;
                                    }.bind(this));
                                  }
                                  else {
                                    return true;
                                  }
                                });
                              }
                              else {
                                lead.updateAttributes({status: 'success'}, function(err, lead) {
                                  if (++total == 3 || num == contractors.length) {
                                    project.updateAttributes({status: 'success'}, function(err, docs) {
                                      flash('info', 'Project updated');
                                      redirect(path_to.project(project));
                                      return false;
                                    }.bind(this));
                                  }
                                  return true;
                                }.bind(this));
                              }
                            });//end lead update
                          }
                        });//end lead create
                      });//end every
                      
                    }.bind(this));

                }
                
              }.bind(this));//end mproject update
        }
      }.bind(this));//end project update
    }
  }.bind(this));//end geolocation
});

action(function index() {
    this.title = 'Projects index';
    Project.all(function (err, projects) {
        render({
            projects: projects
        });
    });
});

action(function show() {
    this.title = 'Project show';
    render();
});

action(function edit() {
    this.title = 'Project edit';
    render();
});

action(function update() {
    
    //will become the data feed for the model
    var data = req.body.Project;
    //update the timestamp
    data['updated'] = new Date().getTime();
    
    //transform data
    data.price = parseFloat(data.price);
  
    Project.validatesPresenceOf('job', 'name', 'phone', 'email', 'address', 'city', 'state', 'zip', 'status');
    Project.validatesFormatOf('email', {"with": /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i});
    Project.validate('price', function(err) {
      if (isNaN(data.price)) {
        return err("Price is not a nummber");
      }
    });
    
    //create address string for geolocation
    var address = req.body.Project["address"]+', '+req.body.Project["city"]+', '+req.body.Project["state"]+' '+req.body.Project["zip"];
    
    //run geolocation service
    geo.geocode(address, function (err, result) {
      
      //here the location is critical. we need to find a real location or else return an error
      if (!result.results[0]) {
        data.location = [ 0, 0 ];
        //TODO: throw error
      }
      
      //record the location and continue
      else {
        data.location = [ result.results[0].geometry.location.lat, result.results[0].geometry.location.lng ];
        
        this.project.updateAttributes(data, function (err, project) {
          
          //report error
          if (err) {
            flash('error', 'Project can not be updated');
            this.title = 'Edit project details';
            render('edit');
          }
          
          else {
            
                Mproject.update({_id: project.id}, data, function (err) {
                  
                  //don't process and just go to the newly created project page
                  if (data.status !== 'process')  {
                    flash('info', 'Project updated');
                    redirect(path_to.project(this.project));
                  }
                  
                  //process the project
                  else {
                    
                    //get a list of nearby contractors via some formula
                    //TODO: set better criteria
                    Muser.find({})
                      .where('status', 'active')
                      .where('role', 'contractor')
                      .where('jobs', project.job)
                      .where('location').near(project.location)
                      .exec(function(err, contractors) {
                        var total = num = 0;
                        contractors.every(function(contractor) {
                          var vals = {};
                          vals.contractor = contractor.id;
                          vals.project = project.id;
                          vals.job = project.job;
                          vals.price = project.price;
                          vals.cc_token = contractor.cc_token;
                          vals.status = 'process';
                          vals.created = vals.updated = new Date().getTime();
                          Lead.create(vals, function(err, lead) {
                            console.log('creating');
                            if (err) {
                              return true;
                            }
                            else {
                              gateway.transaction.sale({
                                amount: lead.price,
                                paymentMethodToken: lead.cc_token
                              }, function (err, result) {
                                console.log('after sale');
                                ++num;
                                if (err || !result.success) {
                                  //error => set to fail
                                  lead.updateAttributes({status: 'failed'}, function(err, lead) {
                                    if (num == contractors.length) {
                                      project.updateAttributes({status: 'success'}, function(err, docs) {
                                        flash('info', 'Project updated');
                                        redirect(path_to.project(project));
                                        return false;
                                      }.bind(this));
                                    }
                                    else {
                                      return true;
                                    }
                                  });
                                }
                                else {
                                  lead.updateAttributes({status: 'success'}, function(err, lead) {
                                    if (++total == 3 || num == contractors.length) {
                                      project.updateAttributes({status: 'success'}, function(err, docs) {
                                        flash('info', 'Project updated');
                                        redirect(path_to.project(project));
                                        return false;
                                      }.bind(this));
                                    }
                                    return true;
                                  }.bind(this));
                                }
                              });//end lead update
                            }
                          });//end lead create
                        });//end every
                        
                      }.bind(this));

                  }
                  
                }.bind(this));//end mproject update
          }
        }.bind(this));//end project update
      }
    }.bind(this));//end geolocation
    
});

action(function destroy() {
    this.project.destroy(function (error) {
        if (error) {
            flash('error', 'Can not destroy project');
        } else {
            flash('info', 'Project successfully removed');
        }
        send("'" + path_to.projects() + "'");
    });
});

action(function createProject() {
  
  var report = {};
  report.errors = [];
  
  var data = {};
  data.created = data.updated = new Date().getTime();
  data.job = req.query.job;
  data.name = req.query.name;
  data.email = req.query.email;
  data.phone = req.query.phone;
  data.address = req.query.address;
  data.address2 = req.query.address2;
  data.city = req.query.city;
  data.state = req.query.state;
  data.zip = req.query.zip;
  data.status = 'process';
  
  Mjob.find({}).where('_id', data.job).exec(function(err, jobs) {
    
    if (err) {
      report.errors.push("couldn't find job.");
      send(report);
    }
    
    else {
      
      data.price = jobs[0].price;
      
      //run geolocation service
      geo.geocode(data.zip, function (err, result) {
        
        //here the location is critical. we need to find a real location or else return an error
        if (!result.results[0]) {
          data.location = [ 0, 0 ];
          report.errors.push("could't find location");
          send(report);
        }
        
        //record the location and continue
        else {
          data.location = [ result.results[0].geometry.location.lat, result.results[0].geometry.location.lng ];
              
          Mproject.create(data, function (err, project) {
            
            if (err) {
              report.errors.push(err);
              send(report);
            }
            
            else {
                
              //get a list of nearby contractors via some formula
              Muser.find({})
                .where('status', 'active')
                .where('role', 'contractor')
                .where('jobs', project.job)
                .where('location').near(project.location)
                .exec(function(err, contractors) {
                  var total = num = 0;
                  contractors.every(function(contractor) {
                    var vals = {};
                    vals.contractor = contractor.id;
                    vals.project = project.id;
                    vals.job = project.job;
                    vals.price = project.price;
                    vals.cc_token = contractor.cc_token;
                    vals.status = 'process';
                    vals.created = vals.updated = new Date().getTime();
                    Lead.create(vals, function(err, lead) {
                      console.log('creating');
                      if (err) {
                        return true;
                      }
                      else {
                        gateway.transaction.sale({
                          amount: lead.price,
                          paymentMethodToken: lead.cc_token
                        }, function (err, result) {
                          console.log('after sale');
                          ++num;
                          if (err || !result.success) {
                            //error => set to fail
                            lead.updateAttributes({status: 'failed'}, function(err, lead) {
                              if (num == contractors.length) {
                                project.updateAttributes({status: 'success'}, function(err, docs) {
                                  send(report);
                                  return false;
                                }.bind(this));
                              }
                              else {
                                return true;
                              }
                            });
                          }
                          else {
                            lead.updateAttributes({status: 'success'}, function(err, lead) {
                              if (++total == 3 || num == contractors.length) {
                                Mproject.update({'_id': project._id}, {status: 'success'}, function(err, docs) {
                                  send(report);
                                  return false;
                                }.bind(this));
                              }
                              return true;
                            }.bind(this));
                          }
                        });//end lead update
                      }
                    });//end lead create
                  });//end every
                  
                }.bind(this));//end find contractors
            }
          }.bind(this));//end mproject create
        }
      }.bind(this));//end geolocation
      
    }
    
  });//end find job
  
  
  
  
  
});

function loadProject() {
    Project.find(params.id, function (err, project) {
        if (err || !project) {
            redirect(path_to.projects());
        } else {
            this.project = project;
            next();
        }
    }.bind(this));
}
