load('application');

layout('admin');

before(use('requireAdmin'));
before(loadLead, {only: ['show', 'edit', 'update', 'destroy']});

var braintree = require('braintree/lib/braintree');
var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: '4yfpm3ndby9rh6y7',
  publicKey: 'xztbktpdrwfpz8db',
  privateKey: 'pgz562g6cgc7k4x5'
});

action('new', function () {
    this.title = 'New lead';
    this.lead = new Lead;
    render();
});

action(function create() {
    
    //will become the data feed for the model
    var data = req.body.Lead;
    //update the timestamp
    data['created'] = data['updated'] = new Date().getTime();
    
    //transform data
    data.price = parseFloat(data.price);
    
    //validate data
    Lead.validatesPresenceOf('project', 'job', 'cc_token', 'status', 'price');
    Lead.validatesNumericalityOf('price', {float: true});
    Lead.validate('price', function(err) {
      if (isNaN(data.price)) {
        return err("Price is not a nummber");
      }
    });
  
    Lead.create(data, function (err, lead) {
      if (!err) {
        //process if requested
        if (lead.status === 'process') {
          gateway.transaction.sale({
            amount: lead.price,
            paymentMethodToken: lead.cc_token
          }, function (err, result) {
            if (!result.success) {
              //set error messages
              var e = '';
              result.errors.deepErrors().forEach(function (error) {
                flash('error', error.message);
                e = error.message;
              });
              //change status to failed and redirect
              lead.updateAttributes({status: 'failed', log: e}, function(err) {
                redirect(path_to.lead(lead));
              });
            }
            else {
              //change status success and redirect
              lead.updateAttributes({status: 'success', log: 'Process successful'}, function(err) {
                flash('info', 'Lead process success!');
                redirect(path_to.lead(lead));
              });
            }
          });
        }
        
        //go to lead page
        else {
          flash('info', 'Lead updated');
          redirect(path_to.lead(lead));
        }
        
      } else {
        flash('error', 'Lead can not be created');
        render('new', {
            lead: lead,
            title: 'New lead'
        });
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
    
    //will become the data feed for the model
    var data = req.body.Lead;
    //update the timestamp
    data['updated'] = new Date().getTime();
    
    //transform data
    data.price = parseFloat(data.price);
    
    //validate data
    //TODO: validate project and job ids are valid and exist in db
    Lead.validatesPresenceOf('project', 'job', 'cc_token', 'status', 'price');
    Lead.validatesNumericalityOf('price', {float: true});
    Lead.validate('price', function(err) {
      if (isNaN(data.price)) {
        return err("Price is not a nummber");
      }
    });
  
    this.lead.updateAttributes(data, function (err) {
        if (!err) {
          //process if reqested
          if (this.lead.status === 'process') {
            gateway.transaction.sale({
              amount: this.lead.price,
              //customerId: this.lead.cc_customer,
              paymentMethodToken: this.lead.cc_token
            }, function (err, result) {
              if (!result.success) {
                //set error messages
                var e = '';
                result.errors.deepErrors().forEach(function (error) {
                  flash('error', error.message);
                  e = error.message;
                });
                //change status to failed and redirect
                this.lead.updateAttributes({status: 'failed', log: e}, function(err) {
                  redirect(path_to.lead(this.lead));
                }.bind(this));
              }
              else {
                //change status success and redirect
                this.lead.updateAttributes({status: 'success', log: 'Process successful'}, function(err) {
                  flash('info', 'Lead process success!');
                  redirect(path_to.lead(this.lead));
                }.bind(this));
              }
            }.bind(this));
          }
          
          //go to lead page
          else {
            flash('info', 'Lead updated');
            redirect(path_to.lead(this.lead));
          }
          
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
