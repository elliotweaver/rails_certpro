load('application');

layout('admin');

before(loadUser, {only: ['show', 'edit', 'update', 'destroy']});

var braintree = require('braintree/lib/braintree');
var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: '4yfpm3ndby9rh6y7',
  publicKey: 'xztbktpdrwfpz8db',
  privateKey: 'pgz562g6cgc7k4x5'
});
var geo = require('geocoder');
var bcrypt = require('bcrypt');

action('new', function () {
    this.title = 'New user';
    this.user = new User;
    this.values = {};
    render();
});

action(function create() {
    
    //will become the data feed for the model
    var data = req.body.User;
    
    //update the timestamp
    data['created'] = data['updated'] = new Date().getTime();
    
    //possibly not needed later but used for custom field values on errors
    this.values = req.body.User;
  
    //salt and hash password
    data.salt = bcrypt.genSaltSync(10);  
    var hash = bcrypt.hashSync(req.body.User['password'], data.salt);
    var hash2 = bcrypt.hashSync(req.body.User['password_confirmation'], data.salt);
    data.hash = bcrypt.hashSync(req.body.User['password'], data.salt);
    req.body.User['password'] = hash;
    req.body.User['password_confirmation'] = hash2;
    
    //validation steps here
    User.validatesPresenceOf('email', 'username', 'role', 'password', 'status');
    User.validatesFormatOf('email', {"with": /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i});
    User.validatesLengthOf('username', {min: 3});
    User.validatesLengthOf('password', {min: 6});
    User.validatesUniquenessOf('email', {message: 'email is not unique'});
    User.validate('password', function(err) {
      if (req.body.User['password'] !== req.body.User['password_confirmation']) {
        return err("Passwords don't match");
      }
    });
    
    //create address string for geolocation
    var address = req.body.User["address"]+', '+req.body.User["city"]+', '+req.body.User["state"]+' '+req.body.User["zip"];
    
    //run geolocation service
    geo.geocode(address, function (err, result) {
      
      //set location as an array
      if (result.results[0]) {
        data.location = [ result.results[0].geometry.location.lat, result.results[0].geometry.location.lng ];
      }
      else {
        data.location = [ 0, 0 ];
      }
      
      //process cc if a number is present
      if (req.body.User['cc_number']) {
        gateway.customer.create({
          creditCard: {
            number: req.body.User['cc_number'],
            expirationDate: req.body.User['cc_month'] + "/" +req.body.User['cc_year'],
            options: {
              verifyCard: true
            }
          }
        }, function (errors, result) {
          //run validation
          User.validate('cc_number', function(err) {
            if (!result.success) {
              return err(errors);
            }
          });
          //set braintree fields if successful
          if (result.success) {
            data.cc_token = result.customer.creditCards[0].token;
            data.cc_last4 = result.customer.creditCards[0].last4;
            data.cc_type = result.customer.creditCards[0].cardType;
            data.cc_customer = result.customer.creditCards[0].customerId;
          }
          delete data.cc_month;
          delete data.cc_year;
          delete data.cc_number;
          //create the user
          User.create(data, function (err, user) {
            console.log(err);
            if (err) {
                flash('error', 'User can not be created');
                render('new', {
                    user: user,
                    title: 'New user'
                });
            } else {
                Muser.update({_id: user.id}, data, function (err) {
                  flash('info', 'User created');
                  redirect(path_to.users());
                });
            }
          });
        });//end braintree create
      }
      
      //cc number not present so just create the user
      else {
        delete data.cc_month;
        delete data.cc_year;
        delete data.cc_number;
        //create the user
        User.create(data, function (err, user) {
          if (err) {
              flash('error', 'User can not be created');
              render('new', {
                  user: user,
                  title: 'New user'
              });
          } else {
              Muser.update({_id: user.id}, data, function (err) {
                flash('info', 'User created');
                redirect(path_to.users());
              });
          }
        });
      }
    });//end geolocation
    
});

action(function index() {
    this.title = 'Users index';
    User.all(function (err, users) {
        render({
            users: users
        });
    });
});

action(function show() {
    this.title = 'User show';
    render();
});

action(function edit() {
    this.title = 'User edit';
    this.values = req.body.User;
    render();
});

action(function update() {
    
    //will eventually be what feeds the database update
    var data = req.body.User;
    
    //set a new updated timestamp
    data['updated'] = new Date().getTime();
    
    //not clear this is perfectly needed. for now control custom field values on error
    this.values = req.body.User;
    
    //create hash password
    if (req.body.User['password'] != '') {  
      var hash = bcrypt.hashSync(req.body.User['password'], this.user.salt);
      var hash2 = bcrypt.hashSync(req.body.User['password_confirmation'], this.user.salt);
      data.hash = hash;
      req.body.User['password'] = hash;
      req.body.User['password_confirmation'] = hash2;
    }
    
    //setup validation steps here
    User.validatesPresenceOf('email', 'username', 'role', 'status', 'address', 'city', 'state', 'zip');
    User.validatesFormatOf('email', {"with": /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i});
    User.validatesLengthOf('username', {min: 3});
    User.validatesUniquenessOf('email', {message: 'email is not unique'});
    User.validate('password', function(err) {
      //make sure passwords match if a new password was entered
      if (req.body.User['password'] != '') {
        if (req.body.User['password'] !== req.body.User['password_confirmation']) {
          return err("Passwords don't match");
        }
      }
    });
    
    //setup address string for use with geolocaiton
    var address = req.body.User["address"]+', '+req.body.User["city"]+', '+req.body.User["state"]+' '+req.body.User["zip"];
    
    //run geolocation service
    geo.geocode(address, function (err, result) {
      
      //save location result as an array
      if (result.results[0]) {
        data.location = [ result.results[0].geometry.location.lat, result.results[0].geometry.location.lng ];
      }
        
      //process cc if a number is present
      if (req.body.User['cc_number']) {
        gateway.customer.create({
          creditCard: {
            number: req.body.User['cc_number'],
            expirationDate: req.body.User['cc_month'] + "/" +req.body.User['cc_year'],
            options: {
              verifyCard: true
            }
          }
        }, function (errors, result) {
          //run validation
          User.validate('cc_number', function(err) {
            if (!result.success) {
              return err(errors);
            }
          });
          //set braintree fields if successful
          if (result.success) {
            data.cc_token = result.customer.creditCards[0].token;
            data.cc_last4 = result.customer.creditCards[0].last4;
            data.cc_type = result.customer.creditCards[0].cardType;
            data.cc_customer = result.customer.creditCards[0].customerId;
          }
          delete data.cc_month;
          delete data.cc_year;
          delete data.cc_number;
          //update attributes
          this.user.updateAttributes(data, function(err, user) {
            if (!err) {
                flash('info', 'User updated');
                redirect(path_to.user(this.user));
            } else {
                Muser.update({_id: this.user.id}, data, function (err) {
                  flash('error', 'User can not be updated');
                  this.title = 'Edit user details';
                  render('edit');
                }.bind(this));
            }
          }.bind(this));
        }.bind(this));//end braintree create
      }
      
      //cc number not present so just update attributes
      else {
        //update attributes
        delete data.cc_month;
        delete data.cc_year;
        delete data.cc_number;
        this.user.updateAttributes(data, function(err, user) {
          if (err) {
            flash('error', 'User can not be updated');
            this.title = 'Edit user details';
            render('edit');
          } else {
              Muser.update({_id: this.user.id}, data, function (err) {
                flash('info', 'User updated');
                redirect(path_to.user(this.user));
              }.bind(this));
          }
        }.bind(this));
      }
      
    }.bind(this));//end geolocation
  
});

action(function destroy() {
    this.user.destroy(function (error) {
        if (error) {
            flash('error', 'Can not destroy user');
        } else {
            flash('info', 'User successfully removed');
        }
        send("'" + path_to.users() + "'");
    });
});

action(function nearbyContractors() {
  var hasContractors = false;
  var values = req.query;
  geo.geocode(values.zip, function (err, result) {
    if (err) {
      send(hasContractors);
    }
    else {
      var location = [ result.results[0].geometry.location.lat, result.results[0].geometry.location.lng ];
      Muser.find({})
        .where('status', 'active')
        .where('role', 'contractor')
        .where('jobs', values.job)
        .where('location').near(location)
        .exec(function (err, contractors) {
          var num = 0;
          contractors.forEach(function(contractor) {
            hasContractors = true;
          });
          send(hasContractors);
      });
    }
  });
});

function loadUser() {
    User.find(params.id, function (err, user) {
        if (err || !user) {
            redirect(path_to.users());
        } else {
            this.user = user;
            Mjob.find({}).where('_id').in(user.jobs).exec(function(err, docs) {
              this.jobs = docs;
              next();
            }.bind(this));
        }
    }.bind(this));
}
